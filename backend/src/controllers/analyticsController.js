const Lead = require('../models/Lead');
const asyncHandler = require('../utils/asyncHandler');

const getAnalytics = asyncHandler(async (req, res) => {
  const [totalLeads, emailsSent, emailsOpened, linkClicks, recentLeads, categoryBreakdown, priorityBreakdown] =
    await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ 'emailTracking.sent': true }),
      Lead.countDocuments({ 'emailTracking.open.openedAt': { $exists: true } }),
      Lead.aggregate([
        { $project: { count: { $size: { $ifNull: ['$emailTracking.clicks', []] } } } },
        { $group: { _id: null, total: { $sum: '$count' } } },
      ]),
      Lead.find().sort({ createdAt: -1 }).limit(8),
      Lead.aggregate([{ $group: { _id: '$aiAnalysis.category', value: { $sum: 1 } } }, { $sort: { value: -1 } }]),
      Lead.aggregate([{ $group: { _id: '$aiAnalysis.priority', value: { $sum: 1 } } }, { $sort: { value: -1 } }]),
    ]);

  const totalClicks = linkClicks[0]?.total || 0;
  const openRate = emailsSent ? Number(((emailsOpened / emailsSent) * 100).toFixed(1)) : 0;
  const clickRate = emailsSent ? Number(((totalClicks / emailsSent) * 100).toFixed(1)) : 0;

  res.json({
    success: true,
    data: {
      totals: {
        totalLeads,
        emailsSent,
        emailsOpened,
        openRate,
        linkClicks: totalClicks,
        clickRate,
      },
      charts: {
        bar: [
          { name: 'Leads', value: totalLeads },
          { name: 'Sent', value: emailsSent },
          { name: 'Opened', value: emailsOpened },
          { name: 'Clicks', value: totalClicks },
        ],
        categories: categoryBreakdown.map((item) => ({ name: item._id || 'Uncategorized', value: item.value })),
        priorities: priorityBreakdown.map((item) => ({ name: item._id || 'Medium', value: item.value })),
      },
      recentLeads,
    },
  });
});

module.exports = { getAnalytics };
