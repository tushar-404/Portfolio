import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const { email, message, explanation } = await request.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const emailContent = explanation || message || 'User wants to connect from portfolio chatbot';
    
    // Log locally for debugging
    console.log('New contact request:', {
      email,
      explanation: emailContent,
      timestamp: new Date().toISOString(),
    });

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is missing in .env.local');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
     const { data, error } = await resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: 'tushar.singh.ggsipu@gmail.com', 
        replyTo: email,
        subject: `New Contact Request from ${email}`,
        html: `
          <h2>New Contact Request from Portfolio</h2>
          <p><strong>From:</strong> ${email}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <hr>
          <h3>Message:</h3>
          <p>${emailContent.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>This email was sent from your portfolio website chatbot.</small></p>
        `,
      });

      if (error) {
        console.error('Resend error:', error);
        return NextResponse.json(
          { error: 'Failed to send email' },
          { status: 500 }
        );
      }

      console.log('Email sent successfully:', data);
      
      return NextResponse.json({
        success: true,
        message: 'Contact request received and email sent successfully!'
      });

    } catch (resendError) {
      console.error('Resend sending error:', resendError);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}