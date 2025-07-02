import { authOptions } from '@/libs/auth';
import { prisma } from "@/libs/PrismaConnect";
import { UiVideo, VIDEO_DIMENSION } from '@/libs/ulinterface';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const videos = await prisma.video.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json({ videos }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      controls = true,
      transformtion = {},
    } = body;

    if (!title || !description || !videoUrl || !thumbnailUrl) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const transformationHeight = transformtion.height ?? VIDEO_DIMENSION.height;
    const transformationWidth = transformtion.width ?? VIDEO_DIMENSION.width;
    const transformationQuality = transformtion.quality ?? null;

    const video = await prisma.video.create({
      data: {
        title,
        description,
        videoUrl,
        thumbnailUrl,
        controls,
        transformationHeight,
        transformationWidth,
        transformationQuality,
      },
    });

    const responseVideo: UiVideo = {
      id: video.id,
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      controls: video.controls,
      transformtion: {
        height: video.transformationHeight,
        width: video.transformationWidth,
        quality: video.transformationQuality ?? undefined,
      },
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
    };

    return NextResponse.json(
      { message: "Video created successfully", video: responseVideo },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error creating video:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}