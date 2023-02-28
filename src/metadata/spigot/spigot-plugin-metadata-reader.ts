import FabricModMetadata from "metadata/fabric/fabric-mod-metadata";
import ModMetadata from "../../metadata/mod-metadata";
import ZippedModMetadataReader from "../../metadata/zipped-mod-metadata-reader";

export default class SpigotPluginMetadataReader extends ZippedModMetadataReader {
    constructor() {
        super("plugin.yml");
    }

    protected loadConfig(buffer: Buffer): Record<string, unknown> {
        return JSON.parse(buffer.toString("utf8"));
    }

    protected createMetadataFromConfig(config: Record<string, unknown>): ModMetadata {
        return new FabricModMetadata(config);
    }
}
