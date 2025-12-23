import { Helmet } from 'react-helmet-async';

interface GeoMetaTagsProps {
    /**
     * Latitude (纬度)
     */
    latitude: number;
    /**
     * Longitude (经度)
     */
    longitude: number;
    /**
     * Place name (地名)
     */
    placename?: string;
    /**
     * Region code (地区代码), e.g. "CN-ZJ" for Zhejiang, China
     */
    region?: string;
}

/**
 * GEO Meta Tags Component
 * Adds geographical meta tags for better local SEO
 * 
 * Usage:
 * <GeoMetaTags 
 *   latitude={30.39} 
 *   longitude={120.17} 
 *   placename="杭州" 
 *   region="CN-ZJ" 
 * />
 */
export function GeoMetaTags({
    latitude,
    longitude,
    placename,
    region
}: GeoMetaTagsProps) {
    const position = `${latitude};${longitude}`;
    const icbm = `${longitude}, ${latitude}`; // ICBM format is lon,lat

    return (
        <Helmet>
            {/* GEO Position */}
            <meta name="geo.position" content={position} />

            {/* ICBM (Internet Classified Business Model) - older standard but still used */}
            <meta name="ICBM" content={icbm} />

            {/* Place name */}
            {placename && <meta name="geo.placename" content={placename} />}

            {/* Region code */}
            {region && <meta name="geo.region" content={region} />}

            {/* Dublin Core geographical coverage */}
            {placename && <meta name="DC.Coverage" content={placename} />}
        </Helmet>
    );
}
