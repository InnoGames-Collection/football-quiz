-- Disable the nightly cron job since we are now using real-time triggers for the leaderboard

SELECT cron.unschedule('refresh-daily-leaderboard');
