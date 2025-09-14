import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { google } from 'googleapis';

export default {
    data: new SlashCommandBuilder()
        .setName('random-gleggmire')
        .setDescription('Zeigt ein zufälliges Video vom Gleggmire'),
    
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

            const channelStats = await youtube.channels.list({
                part: 'statistics',
                id: channelId
            });

            const videoCount = parseInt(channelStats.data.items[0].statistics.videoCount);
            console.log(`📊 Gleggmire hat ${videoCount} Videos insgesamt`);

            const totalPages = Math.ceil(videoCount / 50);
            console.log(`📄 Das sind ${totalPages} Seiten mit je 50 Videos`);

            const maxAccessiblePages = Math.min(totalPages, 20);
            const randomPageNumber = Math.floor(Math.random() * maxAccessiblePages);
            console.log(`🎲 Wähle zufällige Seite: ${randomPageNumber + 1}/${maxAccessiblePages}`);

            let videosResponse = await youtube.search.list({
                part: 'snippet',
                channelId: channelId,
                type: 'video',
                order: 'date',
                maxResults: 50
            });

            for (let i = 0; i < randomPageNumber && videosResponse.data.nextPageToken; i++) {
                videosResponse = await youtube.search.list({
                    part: 'snippet',
                    channelId: channelId,
                    type: 'video',
                    order: 'date',
                    maxResults: 50,
                    pageToken: videosResponse.data.nextPageToken
                });
                console.log(`📄 Springe zu Seite ${i + 2}...`);
            }

            if (!videosResponse.data.items || videosResponse.data.items.length === 0) {
                await interaction.editReply('❌ Keine Videos vom Gleggmire Channel gefunden!');
                return;
            }

            const videos = videosResponse.data.items;
            const randomIndex = Math.floor(Math.random() * videos.length);
            const randomVideo = videos[randomIndex];
            
            const videoId = randomVideo.id.videoId;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

            console.log(`🎯 Gewähltes Video: "${randomVideo.snippet.title}" (Index ${randomIndex + 1}/${videos.length} auf Seite ${randomPageNumber + 1})`);

            const embed = new EmbedBuilder()
                .setTitle(`🎲 ${randomVideo.snippet.title}`)
                .setDescription(randomVideo.snippet.description?.substring(0, 300) + '...' || 'Keine Beschreibung verfügbar')
                .setURL(videoUrl)
                .setColor('#FF6B35')
                .setThumbnail(randomVideo.snippet.thumbnails.high?.url || randomVideo.snippet.thumbnails.default.url)
                .addFields(
                    { name: '📅 Veröffentlicht', value: new Date(randomVideo.snippet.publishedAt).toLocaleDateString('de-DE'), inline: true },
                    { name: '📺 Channel', value: randomVideo.snippet.channelTitle, inline: true }
                )
                .setFooter({ text: '🐸 Ein zufälliges Video von Gleggmire' });

            await interaction.editReply({ 
                content: `🎲 **Hier ist ein zufälliges Video von Gleggmire:**\n${videoUrl}`, 
                embeds: [embed] 
            });

        } catch (error) {
            console.error('❌ Fehler beim Abrufen eines zufälligen Gleggmire Videos:', error);
            
            let errorMessage = '❌ Es gab einen Fehler beim Abrufen eines zufälligen Gleggmire Videos!';
            
            if (error.message.includes('API key')) {
                errorMessage = '❌ YouTube API Key ist nicht konfiguriert oder ungültig!';
            } else if (error.message.includes('quota')) {
                errorMessage = '❌ YouTube API Quota überschritten! Versuche es später nochmal.';
            } else if (error.message.includes('dailyLimitExceeded')) {
                errorMessage = '❌ YouTube API Tageslimit erreicht! Versuche es morgen nochmal.';
            }
            
            await interaction.editReply(errorMessage);
        }
    },
};