import type { MetadataRoute } from 'next'
import { THEME_COLOR } from "@/constants"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'IGNOUMax',
        short_name: 'IGNOUMax',
        description: 'Partner for your IGNOU journey. Get all your IGNOU resources in one place.',
        start_url: '/home',
        display: 'standalone',
        background_color: '#fff',
        theme_color: THEME_COLOR,
        icons: [
            {
                src: "https://ignoumax-prod-s3.s3.ap-south-1.amazonaws.com/public/misc/icon-192x192.png",
                sizes: "192x192",
                type: "image/png"
            },
            {
                src: "https://ignoumax-prod-s3.s3.ap-south-1.amazonaws.com/public/misc/icon-512x512.png",
                sizes: "512x512",
                type: "image/png"
            }
        ],
        screenshots: [
            {
                src: "https://ignoumax-prod-s3.s3.ap-south-1.amazonaws.com/public/misc/screenshot-mobile-1.jpg",
                sizes: "400x822",
                type: "image/jpg",
                form_factor: "narrow"
            },
            {
                src: "https://ignoumax-prod-s3.s3.ap-south-1.amazonaws.com/public/misc/screenshot-mobile-2.jpg",
                sizes: "400x822",
                type: "image/jpg",
                form_factor: "narrow"
            },
            {
                src: "https://ignoumax-prod-s3.s3.ap-south-1.amazonaws.com/public/misc/screenshot-desktop-1.jpg",
                sizes: "1280x676",
                type: "image/jpg",
                form_factor: "wide"
            },
            {
                src: "https://ignoumax-prod-s3.s3.ap-south-1.amazonaws.com/public/misc/screenshot-desktop-2.jpg",
                sizes: "1280x676",
                type: "image/jpg",
                form_factor: "wide"
            }
        ]
    }
}