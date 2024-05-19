"use server"
import { prisma } from "@/lib/db/db";
import { sanitizeString } from "@/utils/sanitize";
import axios from 'axios';

export async function fetchWidgetOptionsByUserKey(userKey) {
  'use server';
  console.log("Fetching widget options for userKey: ", userKey);

  try {
    // Fetch the user by userKey
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

export async function fetchWidgetOptionsByUserId(userId) {
  'use server';
  console.log("Fetching widget options for userId: ", userId);

  try {
    // Fetch the user's widget
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
      // If no widget is found, return an empty result
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

    // Fetch plan options if a plan exists
    const planOptionsData = plan ? await prisma.planOptions.findMany({
      where: { planId: plan.id },
      include: {
        option: true,
      },
    }) : [];

    // Fetch custom options for the widget
    const customOptionsData = await prisma.widgetOptions.findMany({
      where: {
        widgetId: widget.id,
        isCustom: true,
      },
      include: {
        option: true,
      },
    });

    // Map the options to the expected structure
    const planOptions = planOptionsData.map(po => ({
      id: po.option.id,
      name: po.option.name,
      description: po.option.description,
      prompt: po.option.prompt,
      isEnabled: po.option.isEnabled,
      actionParentId: po.option.actionParentId,
    }));

    const customOptions = customOptionsData.map(co => ({
      id: co.option.id,
      name: co.option.name,
      description: co.option.description,
      prompt: co.option.prompt,
      isEnabled: co.option.isEnabled,
      isApproved: co.option.isApproved,
      actionParentId: co.option.actionParentId,
    }));

    // Construct the result
    const result = {
      userId: userId,
      widgetId: widget.id, // Add the widget ID here
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
export async function fetchWidgetOptionsForWebsite(userKey) {
  'use server';
  console.log("Fetching widget options for website for userKey: ", userKey);

  try {
    // Fetch the user by userKey
    const userKeyRecord = await prisma.userKey.findUnique({
      where: { key: userKey },
      include: { user: true },
    });

    if (!userKeyRecord) {
      throw new Error(`User with key ${userKey} not found`);
    }

    const userId = userKeyRecord.user.id;

    // Fetch the user's widget
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
      // If no widget is found, return an empty result
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

    // Fetch plan options if a plan exists and apply filters
    const planOptionsData = plan ? await prisma.planOptions.findMany({
      where: {
        planId: plan.id,
        option: {
          isEnabled: true,
          isApproved: true,
        },
      },
      include: {
        option: true,
      },
    }) : [];

    // Fetch custom options for the widget and apply filters
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

    // Map the options to the expected structure
    const planOptions = planOptionsData.map(po => ({
      id: po.option.id,
      name: po.option.name,
      description: po.option.description,
      prompt: po.option.prompt,
      isEnabled: po.option.isEnabled,
      actionParentId: po.option.actionParentId,
    }));

    const customOptions = customOptionsData.map(co => ({
      id: co.option.id,
      name: co.option.name,
      description: co.option.description,
      prompt: co.option.prompt,
      isEnabled: co.option.isEnabled,
      isApproved: co.option.isApproved,
      actionParentId: co.option.actionParentId,
    }));

    // Construct the result
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


export async function updateOption(widgetId, optionId, isEnabled) {
  try {
    console.log(`Updating option. Widget ID: ${widgetId}, Option ID: ${optionId}, Is Enabled: ${isEnabled}`);
    
    await prisma.widgetActions.update({
      where: { id: optionId },
      data: { isEnabled: isEnabled },
    });
    
    return { success: true };
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
