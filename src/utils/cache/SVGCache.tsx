import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { SvgFromXml, SvgProps } from "react-native-svg";

const ASYNC_STORAGE_KEY = "svg-cache";

let data: any = null;

const loadData = async () => {
    const defaultData = {
        svgs: {},
    };

    const result = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
    data = result ? await JSON.parse(result) : defaultData;
    data = { ...defaultData, ...data };
};

export default class SVGCacheService {
    static async setSvg(uri: string, svg: any) {
        const oldData = data || {};

        const newData = {
            ...oldData,
            svgs: {
                ...oldData.svgs,
                [uri]: svg,
            },
        };

        data = newData;

        await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(newData));
    }

    static async getSvg(uri: string) {
        if (data === null) await loadData();
        return data.svgs[uri];
    }
}

export async function fetchCached(uri: string) {
    const cached = await SVGCacheService.getSvg(uri);
    if (cached) {
        return cached;
    } else {
        const response = await fetch(uri);
        const svg = await response.text();
        SVGCacheService.setSvg(uri, svg);
        return svg;
    }
}

export function CachedSvgUri({ uri, ...props }: SvgProps & { uri: string }) {
    const [xml, setXml] = useState(null);

    useEffect(() => {
        const fetchSvg = async () => {
            try {
                setXml(uri ? await fetchCached(uri) : null);
            } catch (e) {
                console.error(e);
            }
        };

        fetchSvg();
    }, [uri]);

    return <SvgFromXml xml={xml} override={props} />;
}
