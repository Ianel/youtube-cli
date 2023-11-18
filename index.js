#!/usr/bin/env node

import searchSong from "./commands/searchSong.js";

import { Command } from "commander";

const program = new Command();

program.name("song").description("Your video song downloader").version("1.0.0");

program.command("search").description("Search for a song").action(searchSong);

program.parse();
