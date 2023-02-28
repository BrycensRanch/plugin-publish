/* eslint-disable @typescript-eslint/ban-ts-comment */
import PluginPublisher from "publishing/plugin-publisher";
import PublisherTarget from "publishing/publisher-target";
import LoggingStopwatch from "utils/logging/logging-stopwatch";
import { createVersion } from "utils/polymart";
import File from "utils/io/file";

export default class PolymartPublisher extends PluginPublisher {
    public get target(): PublisherTarget {
        return PublisherTarget.Polymart;
    }
    protected async publishPlugin(id: string, token: string, name: string, version: string, channel: string, loaders: string[], gameVersions: string[], java: string[], changelog: string, files: File[]): Promise<void> {
        const stopwatch = new LoggingStopwatch(this.logger, "🔃 Publishing to Polymart");
        const data = {
            title: name || version,
            version_number: version,
            message: changelog,
            game_versions: gameVersions,
            loaders,
        };
        // @ts-expect-error
        data.beta = channel === "beta" ? "1" : "0";
        // @ts-expect-error
        data.snapshot = channel === "alpha" ? "1" : "0";
        await createVersion(id, data, files, token);
        stopwatch.stop();
    }
}