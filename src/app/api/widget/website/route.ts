import { NextResponse } from 'next/server';
import { fetchWidgetOptionsForWebsite } from "@/app/lib/widgetActions"; 

export async function GET(req) {
  const url = new URL(req.url);
  const userKey = url.searchParams.get('userKey');
  console.log(`GET request received from website with userKey: ${userKey}`);

  if (!userKey) {
    console.error('UserKey is required');
    return NextResponse.json({ success: false, error: 'UserKey is required' }, { status: 400 });
  }

  try {
    const widgetData = await fetchWidgetOptionsForWebsite(userKey);
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
