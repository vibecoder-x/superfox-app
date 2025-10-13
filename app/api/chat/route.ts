import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    console.log('Received message:', message);

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-86e1066209a0484b9699dffe59c5e009'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are Superfox, an educational AI for kids aged 5-10. Keep responses SHORT (2-3 sentences max). Answer ONLY what the user asks - do NOT introduce yourself or explain who you are every time. Be friendly, encouraging, and age-appropriate. Use emojis occasionally.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    console.log('DeepSeek API status:', response.status);
    const data = await response.json();
    console.log('DeepSeek API response:', JSON.stringify(data, null, 2));

    if (data.choices && data.choices[0]?.message?.content) {
      return NextResponse.json({
        content: data.choices[0].message.content
      });
    } else {
      console.error('Invalid response structure:', data);
      return NextResponse.json(
        { error: 'Invalid response from AI', details: data },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI', details: String(error) },
      { status: 500 }
    );
  }
}
