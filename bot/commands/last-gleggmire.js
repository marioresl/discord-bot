import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { google } from 'googleapis';

export default {
    data: new SlashCommandBuilder()
        .setName('last-gleggmire')
        .setDescription('Zeigt das neueste Video vom Gleggmire YouTube Channel'),
    
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const youtube = google.youtube({
                version: 'v3',
                auth: process.env.YOUTUBE_API_KEY
            });

            const channelResponse = await youtube.search.list({
                part: 'snippet',
                q: 'gleggmire',
                type: 'channel',
                maxResults: 1
            });

            if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
                await interaction.editReply('❌ Gleggmire Channel nicht gefunden!');
                return;
            }

            const channelId = channelResponse.data.items[0].snippet.channelId;

            const videosResponse = await youtube.search.list({
                part: 'snippet',
                channelId: channelId,
                type: 'video',
                order: 'date',
                maxResults: 1
            });

            if (!videosResponse.data.items || videosResponse.data.items.length === 0) {
                await interaction.editReply('❌ Keine Videos vom Gleggmire Channel gefunden!');
                return;
            }

            const latestVideo = videosResponse.data.items[0];
            const videoId = latestVideo.id.videoId;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

            const embed = new EmbedBuilder()
                .setTitle(latestVideo.snippet.title)
                .setDescription(latestVideo.snippet.description?.substring(0, 200) + '...' || 'Keine Beschreibung verfügbar')
                .setURL(videoUrl)
                .setColor('#FF0000')
                .setThumbnail(latestVideo.snippet.thumbnails.high?.url || latestVideo.snippet.thumbnails.default.url)
                .addFields(
                    { name: '📅 Veröffentlicht', value: new Date(latestVideo.snippet.publishedAt).toLocaleDateString('de-DE'), inline: true },
                    { name: '📺 Channel', value: latestVideo.snippet.channelTitle, inline: true }
                )
                .setFooter({ text: '🐸 Gleggmire\'s neuestes Video' });

            await interaction.editReply({ 
                content: `🎬 **Hier ist das neueste Video von Gleggmire:**\n${videoUrl}`, 
                embeds: [embed] 
            });

        } catch (error) {
            console.error('❌ Fehler beim Abrufen des Gleggmire Videos:', error);
            
            let errorMessage = '❌ Es gab einen Fehler beim Abrufen des neuesten Gleggmire Videos!';
            
            if (error.message.includes('API key')) {
                errorMessage = '❌ YouTube API Key ist nicht konfiguriert oder ungültig!';
            } else if (error.message.includes('quota')) {
                errorMessage = '❌ YouTube API Quota überschritten! Versuche es später nochmal.';
            }
            
            await interaction.editReply(errorMessage);
        }
    },
};
