import ModMetadata from "../../metadata/mod-metadata";
import ZippedModMetadataReader from "../../metadata/zipped-mod-metadata-reader";
import YAML from "yaml";
import SpigotPluginMetadata from "./spigot-plugin-metadata";

export default class SpigotPluginMetadataReader extends ZippedModMetadataReader {
    constructor() {
        super("plugin.yml");
    }

    protected loadConfig(buffer: Buffer): Record<string, unknown> {
        return YAML.parse(buffer.toString("utf8"))
    }

    protected createMetadataFromConfig(config: Record<string, unknown>): ModMetadata {
        return new SpigotPluginMetadata(config);
    }
}
