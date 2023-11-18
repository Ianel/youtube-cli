import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import axios from "axios";
import { Downloader } from "ytdl-mp3";

async function input() {
    const answers = await inquirer.prompt([
        {
            name: "title",
            message: "Enter the title of the song",
            type: "input",
        },
        {
            name: "artist",
            message: "Enter the name of the artist",
            type: "input",
        },
    ]);

    return answers;
}

export default async function getSong() {
    const songInfos = await input();

    const apiKey = "AIzaSyCLU4psFbObetR5oly5-riXUA1gZH-CBNk";
    const searchTerm = `${songInfos.artist} ${songInfos.title}`;

    const apiUrl = "https://www.googleapis.com/youtube/v3/search";
    const params = {
        key: apiKey,
        q: searchTerm,
        part: "snippet",
        type: "video",
        maxResults: 1,
    };

    axios
        .get(apiUrl, { params })
        .then(async (response) => {
            const firstVideo = response.data.items[0];

            if (firstVideo) {
                const videoId = firstVideo.id.videoId;
                const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

                const downloader = new Downloader({
                    getTags: true,
                });

                let spinner = ora(
                    `Downloading ${songInfos.title} by ${songInfos.artist}...`
                ).start();

                await downloader.downloadSong(videoUrl);

                spinner.stop();

                console.log(
                    chalk.greenBright(
                        `${songInfos.title} by ${songInfos.artist} downloaded successfully`
                    )
                );
            }
        })
        .catch((err) => {
            console.log(chalk.redBright(`\n${err}`));
        });
}
