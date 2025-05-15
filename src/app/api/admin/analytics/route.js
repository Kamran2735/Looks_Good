import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { NextResponse } from 'next/server';

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
});

export async function GET() {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${process.env.GA_PROPERTY_ID}`,
      dimensions: [
        { name: 'pagePath' },
        { name: 'pageTitle' }, // Add page title
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' }, // Add user count
      ],
      dateRanges: [{ startDate: '2daysAgo', endDate: 'today' }],
      orderBys: [
        {
          metric: {
            metricName: 'screenPageViews',
          },
          desc: true,
        },
      ],
      limit: 5,
      timezoneCode: 'America/New_York',
    });

    const pages = (response.rows || []).map(row => ({
      path: row.dimensionValues[0].value,
      title: row.dimensionValues[1].value,
      views: row.metricValues[0].value,
      users: row.metricValues[1].value,
    }));

    return NextResponse.json({ success: true, pages });
  } catch (error) {
    console.error('GA Error:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
