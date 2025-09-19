import { NextRequest, NextResponse } from 'next/server';
import { omnisendClient } from '@/lib/omnisend/client';

export async function GET(_request: NextRequest) {
  try {
    console.log('🧪 Testing Omnisend connectivity...');

    // Test creating a contact
    const testContact = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      tags: ['test', 'omnisend-verification'],
    };

    console.log('📧 Creating test contact in Omnisend...');
    const contactResult = await omnisendClient.createContact(testContact);

    console.log('📧 Contact creation result:', contactResult);

    return NextResponse.json({
      success: true,
      message: 'Omnisend connectivity test successful',
      contactResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Omnisend test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
