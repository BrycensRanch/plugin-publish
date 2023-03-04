import FabricModMetadataReader from "./fabric/fabric-mod-metadata-reader";
import ForgeModMetadataReader from "./forge/forge-mod-metadata-reader";
import QuiltModMetadataReader from "./quilt/quilt-mod-metadata-reader";
import ModLoaderType from "./mod-loader-type";
import ModMetadataReader from "./mod-metadata-reader";
import SpigotPluginMetadataReader from "./spigot/spigot-plugin-metadata-reader";

export default class ModMetadataReaderFactory {
    public create(loaderType: ModLoaderType): ModMetadataReader {
        switch (loaderType) {
            case ModLoaderType.Fabric:
                return new FabricModMetadataReader();

            case ModLoaderType.Forge:
                return new ForgeModMetadataReader();

            case ModLoaderType.Quilt:
                return new QuiltModMetadataReader();
            case ModLoaderType.Spigot:
                return new SpigotPluginMetadataReader();

            default:
                throw new Error(`Unknown mod/plugin loader "${ModLoaderType.toString(loaderType)}"`);
        }
    }
}
