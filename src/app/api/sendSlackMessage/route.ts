import {NextResponse} from 'next/server';

import apiHub from '@/hooks/useApiClient';

export async function POST(request: Request) {
  try {
    const {message} = await request.json();

    const slackResponse = await apiHub.post(
      process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL ?? '',
      {
        channel: process.env.NEXT_PUBLIC_SLACK_CHANNEL_ID,
        text: message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SLACK_BOT_TOKEN}`,
        },
      },
    );

    return NextResponse.json({data: slackResponse.data});
  } catch (error) {
    console.error('Error sending message to Slack:', error);
    return NextResponse.json({error: 'Error sending message to Slack'}, {status: 500});
  }
}
