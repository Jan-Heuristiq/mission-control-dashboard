
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Helper to format numbers as EUR currency
const formatCurrency = (value: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const {
        heuristiqRevenue,
        totalTarget,
        heuristiqProgress,
        thisMonthHeuristiqRevenue,
        thisMonthHeuristiqTarget,
        thisMonthHeuristiqProgress,
        echodeckRevenue,
        echodeckMission,
        echodeckArrProgress,
        echodeckCustomers,
        thisMonthEchodeckRevenue,
        thisMonthEchodeckTarget,
        thisMonthEchodeckProgress,
    } = req.body;

    const slackToken = process.env.SLACK_BOT_TOKEN;
    const appUrl = process.env.VITE_APP_URL || 'https://your-app-url.vercel.app'; // Fallback URL
    const channelId = "C09811NMK99";

    if (!slackToken) {
        return res.status(500).json({ error: 'SLACK_BOT_TOKEN environment variable not set.' });
    }

    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "📊 Mission Control: Progress Update",
                "emoji": true
            }
        },
        { "type": "divider" },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Mission 1: Services Revenue (Heuristiq)*"
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": `*Overall Progress:*\n${formatCurrency(heuristiqRevenue)} / ${formatCurrency(totalTarget)} (${heuristiqProgress.toFixed(1)}%)`
                },
                {
                    "type": "mrkdwn",
                    "text": `*This Month's Pacing:*\n${formatCurrency(thisMonthHeuristiqRevenue)} of ${formatCurrency(thisMonthHeuristiqTarget)} (${thisMonthHeuristiqProgress.toFixed(1)}%)`
                }
            ]
        },
        { "type": "divider" },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `*Mission 2: Echodeck Growth* (${echodeckCustomers} / ${echodeckMission.target_customers} Customers)`
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": `*ARR Progress:*\n${formatCurrency(echodeckRevenue)} / ${formatCurrency(echodeckMission.target_arr)} (${echodeckArrProgress.toFixed(1)}%)`
                },
                {
                    "type": "mrkdwn",
                    "text": `*This Month's Pacing:*\n${formatCurrency(thisMonthEchodeckRevenue)} of ${formatCurrency(thisMonthEchodeckTarget)} (${thisMonthEchodeckProgress.toFixed(1)}%)`
                }
            ]
        },
        { "type": "divider" },
        {
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": `For more details, visit the <${appUrl}|Mission Control Dashboard>.`
                }
            ]
        }
    ];

    try {
        const response = await fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${slackToken}`,
            },
            body: JSON.stringify({
                channel: channelId,
                blocks: blocks,
                text: `Mission Control Progress Update: Heuristiq ${heuristiqProgress.toFixed(1)}%, Echodeck ${echodeckArrProgress.toFixed(1)}%` // Fallback for notifications
            }),
        });

        const slackData = await response.json();

        if (!slackData.ok) {
            // Slack API returns errors in the `error` field
            throw new Error(`Slack API error: ${slackData.error}`);
        }

        return res.status(200).json({ success: true, message: 'Message posted to Slack.' });

    } catch (error: any) {
        console.error('Error posting to Slack:', error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}
