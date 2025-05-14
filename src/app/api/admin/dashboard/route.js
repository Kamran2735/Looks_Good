import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';

// Unified month start util
function getMonthStartJS(offset = 0) {
  const d = new Date();
  d.setMonth(d.getMonth() + offset, 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET() {
  try {
    // Get the start of the current month timestamp
    const currentMonthStart = Timestamp.fromDate(getMonthStartJS(0));
    
    // Archive collection
    const archiveRef = collection(db, 'archive');
    const archiveDocs = await getDocs(archiveRef);
    const archiveTotal = archiveDocs.size;

    // Get archive items from last month to calculate growth
    const archiveLastMonthEndSnap = await getDocs(
      query(
        archiveRef,
        where('dateAdded', '<', currentMonthStart)
      )
    );
    const archiveLastMonthEnd = archiveLastMonthEndSnap.size;

    // Calculate growth rate
    const archiveGrowth = archiveLastMonthEnd > 0 
      ? ((archiveTotal - archiveLastMonthEnd) / archiveLastMonthEnd) * 100 
      : (archiveTotal > 0 ? 100 : 0);
    
    // Get this month's operations
    const logsRef = collection(db, 'activity_logs');
    const thisMonthLogsSnap = await getDocs(
      query(
        logsRef,
        where('timestamp', '>=', currentMonthStart)
      )
    );
    
    // Count operations by type
    const operations = {
      insertions: 0,
      updates: 0,
      deletions: 0
    };
    
    thisMonthLogsSnap.forEach(doc => {
      const data = doc.data();
      if (data.operation === 'create') operations.insertions++;
      if (data.operation === 'update') operations.updates++;
      if (data.operation === 'delete') operations.deletions++;
    });
    
    // Team collection
    const teamRef = collection(db, 'team_members');
    const teamDocs = await getDocs(teamRef);
    const teamTotal = teamDocs.size;

    // Get team members from last month to calculate growth
    const teamLastMonthEndSnap = await getDocs(
      query(
        teamRef,
        where('dateAdded', '<', currentMonthStart)
      )
    );
    const teamLastMonthEnd = teamLastMonthEndSnap.size;

    // Calculate growth rate
    const teamGrowth = teamLastMonthEnd > 0 
      ? ((teamTotal - teamLastMonthEnd) / teamLastMonthEnd) * 100 
      : (teamTotal > 0 ? 100 : 0);

    // Format change percentage - keep the negative sign when negative growth occurs
    const formatChange = (change) => {
      return (change > 0 ? '+' : '') + Math.round(change) + '%';
    };

    return Response.json({
      success: true,
      stats: {
        team: {
          total: teamTotal,
          change: formatChange(teamGrowth),
        },
        archive: {
          total: archiveTotal,
          change: formatChange(archiveGrowth),
        },
        operations: {
          insertions: operations.insertions,
          updates: operations.updates,
          deletions: operations.deletions
        }
      }
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}