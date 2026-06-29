"use client";

import Button from "../../../../components/Button";
import Link from "next/link";
import formatDate from "../../../../lib/helpers/formatDate";
import { FE_URL } from "../../../../config";

interface FormCardProps {
  slug: string;
  title: string;
  description: string;
  isPublished: boolean;
  createdAt: Date;
}

export default function FormCard(props: FormCardProps) {
  return (
    <div className="bg-white shadow-xs w-full flex flex-col gap-6 px-6 py-4 border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="font-medium">{props.title}</p>

          {props.isPublished === true ? (
            <p className="text-sm text-green-500 font-medium">Published</p>
          ) : (
            <p className="text-sm text-gray-500 font-medium">Draft</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link href={`${FE_URL}/form/${props.slug}/design`}>
            <Button
              variant="secondary"
              size="md"
              onClick={() => console.log("Hi there..")}
            >
              Design
            </Button>
          </Link>

          <Link href={`${FE_URL}/form/${props.slug}/dashboard`}>
            <Button
              variant="secondary"
              size="md"
              onClick={() => console.log("Hi there..")}
            >
              Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Description */}
      <div className="flex justify-between items-end gap-8">
        <p>{props.description}</p>

        <p className="text-sm text-right text-gray-800 min-w-20">
          {formatDate(new Date(props.createdAt))}
        </p>
      </div>
    </div>
  );
}
