import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminRequest } from '@/lib/adminAuthCheck';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { handleApiError } from '@/lib/errorHandler';
import { isValidPhone, isValidEmail, cleanPhone } from '@/lib/validators';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { name, phone, email, password, licenseNo, isActive } = body;

    let updateData: any = {};
    if (name) updateData.name = name.trim();
    if (phone) {
      const cleaned = cleanPhone(phone);
      if (!isValidPhone(cleaned)) {
        return NextResponse.json(
          { success: false, error: 'Please provide a valid 10-digit Indian mobile number.' },
          { status: 400 }
        );
      }
      updateData.phone = cleaned;
    }
    if (email !== undefined) {
      if (email && email.trim() !== '' && !isValidEmail(email)) {
        return NextResponse.json(
          { success: false, error: 'Please provide a valid official email format.' },
          { status: 400 }
        );
      }
      updateData.email = email ? email.trim() : null;
    }
    if (licenseNo !== undefined) updateData.licenseNo = licenseNo ? licenseNo.trim() : null;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (password && password.trim() !== '') {
      updateData.passwordHash = await hashPassword(password);
    }

    const updated = await prisma.driver.update({
      where: { id: params.id },
      data: updateData,
      include: {
        vehicles: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return handleApiError(error, 'Failed to update driver account.');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    await prisma.driver.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: 'Driver deleted successfully' });
  } catch (error: any) {
    return handleApiError(error, 'Failed to delete driver account.');
  }
}
