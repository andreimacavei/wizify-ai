import { NextResponse } from 'next/server';
import { fetchWidgetOptionsByUserKey, fetchWidgetOptionsByUserId, updateOption, deleteCustomOption, addCustomAction } from "@/app/lib/widgetActions"; 

export async function GET(req) {
  const url = new URL(req.url);
  const userKey = url.searchParams.get('userKey');
  const userId = url.searchParams.get('userId');
  console.log(`GET request received with userKey: ${userKey}, userId: ${userId}`);

  if (!userKey && !userId) {
    console.error('UserKey or UserId is required');
    return NextResponse.json({ success: false, error: 'UserKey or UserId is required' }, { status: 400 });
  }

  try {
    const widgetData = userKey ? await fetchWidgetOptionsByUserKey(userKey) : await fetchWidgetOptionsByUserId(userId);
    if ('error' in widgetData) {
      console.error(`Error fetching widget options: ${widgetData.error}`);
      return NextResponse.json(widgetData, { status: 404 });
    }
    console.log('Widget options fetched successfully');
    return NextResponse.json(widgetData, { status: 200 });
  } catch (error) {
    console.error('Error in GET request:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { widgetId, name, description, prompt, actionParentId } = await req.json();
    console.log(`POST request received with data: widgetId=${widgetId}, name=${name}, description=${description}, prompt=${prompt}, actionParentId=${actionParentId}`);

    if (name && description && prompt) {
      const response = await addCustomAction(widgetId, name, description, prompt, actionParentId);
      if (!response.success) {
        console.error(`Error adding custom action: ${response.error}`);
        return NextResponse.json(response, { status: 500 });
      }
      console.log('Custom action added successfully');
      return NextResponse.json({ success: true, action: response.action }, { status: 200 });
    } else {
      console.error('Invalid input for POST request');
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const { widgetId, optionId } = await req.json();
    console.log(`DELETE request received with data: widgetId=${widgetId}, optionId=${optionId}`);

    if (!widgetId || !optionId) {
      console.error('WidgetId and optionId are required for DELETE request');
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    const response = await deleteCustomOption(widgetId, optionId);
    if (!response.success) {
      console.error(`Error deleting custom option: ${response.error}`);
      return NextResponse.json(response, { status: 500 });
    }
    console.log('Custom option deleted successfully');
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE request:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { widgetId, optionId, isEnabled, description, prompt } = await req.json();
    console.log(`PUT request received with data: widgetId=${widgetId}, optionId=${optionId}, isEnabled=${isEnabled}, description=${description}, prompt=${prompt}`);

    if (!widgetId || !optionId || typeof isEnabled !== 'boolean' || !description || !prompt) {
      console.error('Invalid input for PUT request');
      console.log("widgetId: " + widgetId);
      console.log("optionId: " + optionId);
      console.log("isEnabled: " + isEnabled);
      console.log("description: " + description);
      console.log("prompt: " + prompt);
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    const response = await updateOption(widgetId, optionId, isEnabled, description, prompt);
    if (!response.success) {
      console.error(`Error updating option: ${response.error}`);
      return NextResponse.json(response, { status: 500 });
    }
    console.log('Option updated successfully');
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in PUT request:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}