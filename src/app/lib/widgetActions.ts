"use server"
import { prisma } from "@/lib/db/db";
import { sanitizeString } from "@/utils/sanitize";


interface Option {
  id: number;
  name: string;
  description?: string;
  prompt?: string;
  isEnabled: boolean;
  isApproved?: boolean;
  actionParentId?: number | null;
  children: Option[];
}

const mapOptions = (optionsData: any[]): Option[] => {
  const optionsMap: { [key: number]: Option } = {};
  
  optionsData.forEach(opt => {
    const option: Option = {
      id: opt.option.id,
      name: opt.option.name,
      description: opt.option.description,
      prompt: opt.option.prompt,
      isEnabled: opt.option.isEnabled,
      actionParentId: opt.option.actionParentId,
      children: [],
    };
    optionsMap[opt.option.id] = option;
  });

  optionsData.forEach(opt => {
    if (opt.option.actionParentId) {
      optionsMap[opt.option.actionParentId].children.push(optionsMap[opt.option.id]);
    }
  });

  return Object.values(optionsMap).filter(opt => !opt.actionParentId);
};

export async function fetchWidgetOptionsByUserKey(userKey: string) {
  'use server';
  console.log("Fetching widget options for userKey: ", userKey);

  try {
    const userKeyRecord = await prisma.userKey.findUnique({
      where: { key: userKey },
      include: { user: true },
    });

    if (!userKeyRecord) {
      throw new Error(`User with key ${userKey} not found`);
    }

    const userId = userKeyRecord.user.id;
    return fetchWidgetOptionsByUserId(userId);
  } catch (error) {
    console.log('Error fetching widget options by user key: ', error);
    return { success: false, error: error.message };
  }
}

export async function fetchWidgetOptionsByUserId(userId: string) {
  'use server';
  console.log("Fetching widget options for userId: ", userId);

  try {
    const widget = await prisma.widget.findUnique({
      where: { userId },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
        widgetOptions: {
          include: {
            option: true,
          },
        },
      },
    });

    if (!widget) {
      return {
        userId: userId,
        widgetId: null,
        subscriptionId: null,
        planName: null,
        planOptions: [],
        customOptions: [],
      };
    }

    const subscription = widget.subscription;
    const plan = subscription?.plan;

    const planOptionsData = plan ? await prisma.planOptions.findMany({
      where: { planId: { lte: plan.id } },
      include: {
        option: true,
      },
    }) : [];

    const customOptionsData = await prisma.widgetOptions.findMany({
      where: {
        widgetId: widget.id,
        isCustom: true,
      },
      include: {
        option: true,
      },
    });

    const planOptions = mapOptions(planOptionsData);
    const customOptions = mapOptions(customOptionsData);

    const result = {
      userId: userId,
      widgetId: widget.id,
      subscriptionId: subscription?.id || null,
      planName: plan?.name || null,
      planOptions: planOptions,
      customOptions: customOptions,
    };

    return result;
  } catch (error) {
    console.log('Error fetching widget options: ', error);
    return { success: false, error: error.message };
  }
}

export async function fetchWidgetOptionsForWebsite(userKey: string) {
  'use server';
  console.log("Fetching widget options for website for userKey: ", userKey);

  try {
    const userKeyRecord = await prisma.userKey.findUnique({
      where: { key: userKey },
      include: { user: true },
    });

    if (!userKeyRecord) {
      throw new Error(`User with key ${userKey} not found`);
    }

    const userId = userKeyRecord.user.id;

    const widget = await prisma.widget.findUnique({
      where: { userId },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
        widgetOptions: {
          include: {
            option: true,
          },
        },
      },
    });

    if (!widget) {
      return {
        userId: userId,
        widgetId: null,
        subscriptionId: null,
        planName: null,
        planOptions: [],
        customOptions: [],
      };
    }

    const subscription = widget.subscription;
    const plan = subscription?.plan;

    const planOptionsData = plan ? await prisma.planOptions.findMany({
      where: {
        planId: { lte: plan.id },
        option: {
          isEnabled: true,
          isApproved: true,
        },
      },
      include: {
        option: true,
      },
    }) : [];

    const customOptionsData = await prisma.widgetOptions.findMany({
      where: {
        widgetId: widget.id,
        isCustom: true,
        option: {
          isEnabled: true,
          isApproved: true,
        },
      },
      include: {
        option: true,
      },
    });

    const planOptions = mapOptions(planOptionsData);
    const customOptions = mapOptions(customOptionsData);

    const result = {
      userId: userId,
      widgetId: widget.id,
      subscriptionId: subscription?.id || null,
      planName: plan?.name || null,
      planOptions: planOptions,
      customOptions: customOptions,
    };

    return result;
  } catch (error) {
    console.log('Error fetching widget options for website: ', error);
    return { success: false, error: error.message };
  }
}

export async function updateOption(widgetId, optionId, isEnabled, description, prompt) {
  try {
    console.log(`Updating option. Widget ID: ${widgetId}, Option ID: ${optionId}, Is Enabled: ${isEnabled}, Description: ${description}, Prompt: ${prompt}`);

    const existingOption = await prisma.widgetActions.findUnique({
      where: { id: optionId },
    });

    if (!existingOption) {
      throw new Error(`Option with ID ${optionId} not found`);
    }

    const updateData: { isEnabled: boolean; description: string; prompt: string; isApproved?: boolean } = {
      isEnabled: isEnabled,
      description: description,
      prompt: prompt,
    };

    if (existingOption.prompt !== prompt) {
      updateData.isApproved = false;
    }

    await prisma.widgetActions.update({
      where: { id: optionId },
      data: updateData,
    });

    return { success: true, promptChanged: existingOption.prompt !== prompt };
  } catch (error) {
    console.error('Error updating option: ', error);
    return { success: false, error: error.message };
  }
}


export async function deleteCustomOption(widgetId, optionId) {
  try {
    console.log(`Deleting custom option. Widget ID: ${widgetId}, Option ID: ${optionId}`);
    
    const widgetOption = await prisma.widgetOptions.findUnique({
      where: { widgetId_optionId: { widgetId, optionId } },
    });

    if (!widgetOption) {
      console.error(`Widget option with Widget ID: ${widgetId} and Option ID: ${optionId} does not exist`);
      return { success: false, error: 'Widget option does not exist' };
    }

    await prisma.$transaction(async (prisma) => {
      // Delete from WidgetOptions
      await prisma.widgetOptions.delete({
        where: { widgetId_optionId: { widgetId, optionId } },
      });

      // Check if the WidgetActions is still referenced
      const count = await prisma.widgetOptions.count({
        where: { optionId },
      });

      // If not referenced, delete from WidgetActions
      if (count === 0) {
        await prisma.widgetActions.delete({
          where: { id: optionId },
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting custom option: ', error);
    return { success: false, error: error.message };
  }
}

export async function addCustomAction(widgetId, name, description, prompt, actionParentId) {
  try {
    console.log(`Adding custom action. Widget ID: ${widgetId}, Name: ${name}, Description: ${description}, Prompt: ${prompt}`);
    const customAction = await prisma.widgetActions.create({
      data: {
        name,
        description,
        prompt,
        isEnabled: true,
        isApproved: false,
        actionParentId: actionParentId || null, // Add the actionParentId field
        widgetOptions: {
          create: {
            widgetId,
            isCustom: true,
          },
        },
      },
    });

    return { success: true, action: customAction };
  } catch (error) {
    console.error('Error adding custom action: ', error);
    return { success: false, error: error.message };
  }
}

export async function fetchWidgetAction(actionId) {
  'use server';
  console.log("Fetching widget action for actionId: ", actionId);

  try {
    const action = await prisma.widgetActions.findUnique({
      where: { id: actionId },
    });

    if (!action) {
      throw new Error(`Action with ID ${actionId} not found`);
    }

    return {
      id: action.id,
      name: action.name,
      description: action.description,
      prompt: action.prompt,
      isEnabled: action.isEnabled,
      isApproved: action.isApproved,
      actionParentId: action.actionParentId,
    };
  } catch (error) {
    console.log('Error fetching widget action: ', error);
    return { success: false, error: error.message };
  }
}
