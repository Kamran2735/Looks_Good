import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';

export async function PUT(req, { params }) {
  const { id } = params;
  const data = await req.json();

  try {
    const ref = doc(db, 'team_members', id);
    await updateDoc(ref, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const memberRef = doc(db, 'team_members', id);
    const docSnap = await getDoc(memberRef);
    if (!docSnap.exists()) throw new Error('Member not found');

    // Backup
    await addDoc(collection(db, 'team_members_deleted'), {
      ...docSnap.data(),
      dateDeleted: new Date(),
    });

    // Delete
    await deleteDoc(memberRef);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
