import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { doc, updateDoc, deleteDoc, getDoc, setDoc, collection, addDoc, Timestamp } from 'firebase/firestore';

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

    const memberData = docSnap.data();

    // Backup deleted member to a different collection
    await addDoc(collection(db, 'team_members_deleted'), {
      ...memberData,
      dateDeleted: Timestamp.now(),
    });

    // Remove image from Supabase Storage if hosted there
    if (memberData.image?.includes('/team-media/')) {
      const filePath = memberData.image.split('/team-media/')[1];
      const { error: storageError } = await supabase.storage.from('team-media').remove([filePath]);
      if (storageError) {
        console.warn('Failed to delete image from Supabase:', storageError.message);
      }
    }

    // Delete member from Firestore
    await deleteDoc(memberRef);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE Error:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
