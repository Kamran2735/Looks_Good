// app/api/admin/trash/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
  Timestamp,
  query,
  where,
  collectionGroup,
} from 'firebase/firestore';

/**
 * Collection mapping for better database organization
 */
const collectionMapping = {
  'archive': {
    deleted: 'archive_deleted',
    original: 'archive'
  },
  'team_members': {
    deleted: 'team_members_deleted',
    original: 'team_members'
  },
  // Add others as needed
};


// Helper to get the original collection from a deleted collection name
const getOriginalCollection = (deletedCollection) => {
  for (const [original, config] of Object.entries(collectionMapping)) {
    if (config.deleted === deletedCollection) {
      return original;
    }
  }
  return null;
};

/**
 * GET handler — Fetch items from the corresponding "_deleted" collections
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'all';

  try {
    let items = [];

    if (type === 'all') {
      // Fetch from all deleted collections
      for (const [original, config] of Object.entries(collectionMapping)) {
        const deletedCollectionRef = collection(db, config.deleted);
        const snapshot = await getDocs(deletedCollectionRef);
        const collectionItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          originalCollection: original // Store the source collection name
        }));
        items = [...items, ...collectionItems];
      }
    } else {
      // Fetch from a specific deleted collection
      const deletedCollectionRef = collection(db, type);
      const snapshot = await getDocs(deletedCollectionRef);
      const originalCollection = getOriginalCollection(type);
      
      items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        originalCollection: originalCollection // Store the source collection name
      }));
    }

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching trash items:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

/**
 * POST handler — Handles restore and permanent delete actions
 */
export async function POST(req) {
  try {
    const { id, collection, action } = await req.json();

    if (!id || !collection || !action) {
      return NextResponse.json({
        success: false,
        message: 'Missing required parameters: id, collection, and action are required.'
      }, { status: 400 });
    }

    // Find the corresponding deleted collection
    const collectionConfig = collectionMapping[collection];
    
    if (!collectionConfig) {
      return NextResponse.json({
        success: false,
        message: `Unsupported collection type: ${collection}`
      }, { status: 400 });
    }

    const deletedCollection = collectionConfig.deleted;
    const originalCollection = collectionConfig.original;
    
    const deletedDocRef = doc(db, deletedCollection, id);
    const deletedSnap = await getDoc(deletedDocRef);

    if (!deletedSnap.exists()) {
      return NextResponse.json({
        success: false,
        message: 'Item not found in deleted collection.'
      }, { status: 404 });
    }

    const itemData = deletedSnap.data();

    // Handle restore action
    if (action === 'restore') {
      // Remove trash-specific fields before restoring
      const { deletedAt, ...restoreData } = itemData;
      
      await setDoc(doc(db, originalCollection, id), {
        ...restoreData,
        dateRestored: Timestamp.now(),
      });
      
      await deleteDoc(deletedDocRef);

      return NextResponse.json({
        success: true,
        message: 'Item restored successfully.'
      });
    }

    // Handle permanent delete action
    if (action === 'permanent-delete') {
      await deleteDoc(deletedDocRef);

      return NextResponse.json({
        success: true,
        message: 'Item permanently deleted.'
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action. Supported actions are "restore" and "permanent-delete".'
    }, { status: 400 });
  } catch (error) {
    console.error('Error processing trash action:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}