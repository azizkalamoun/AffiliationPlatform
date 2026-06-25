"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchUrlsOfUser } from "@/services/affiliateUrl";
import Modal from "@/components/ui/modal";
import { fetchBannersByUrlId } from "@/services/banner";
import { Url, Banner, item } from "@/types";

const MyLinksPage = () => {
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState("");
  const [refId, setRefId] = useState("");
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [showBannersModal, setShowBannersModal] = useState(false);
  const [banners, setBanners] = useState<Banner[]>([]);

  const { data: affiliateUrls } = useFetchUrlsOfUser();

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log("Copied to clipboard");
        setCopiedUrl(text);
        setShowCopyMessage(true);
        setTimeout(() => setShowCopyMessage(false), 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const handleFetchBanners = async (
    urlId: string,
    url: string,
    refId: string
  ) => {
    setSelectedUrl(url);
    setShowBannersModal(true);
    setRefId(refId);
    try {
      const bannersData = await fetchBannersByUrlId(urlId);
      setBanners(bannersData);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const handleCopyImageUrl = (imageUrl: string) => {
    handleCopyToClipboard(
      `<a href="${selectedUrl}" download="banner_image"><img src="${imageUrl}" alt="Banner Image" /></a>`
    );
  };

  const handleBannerModalClose = () => {
    setShowBannersModal(false);
    setRefId("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Links</CardTitle>
        <CardDescription>A list of your approved links.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>URL</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(affiliateUrls) &&
              affiliateUrls.length > 0 &&
              affiliateUrls?.map((affiliateUrl: item) => (
                <TableRow
                  key={affiliateUrl.affiliate_id + "-" + affiliateUrl.url_id}
                >
                  <TableCell
                    onClick={() =>
                      handleCopyToClipboard(
                        `${affiliateUrl.url}?ref=${affiliateUrl.affiliate_id}`
                      )
                    }
                    className="cursor-pointer"
                  >
                    {`${affiliateUrl.url}/register?ref=${affiliateUrl.affiliate_id}`}
                  </TableCell>
                  <TableCell>{affiliateUrl.CompanyName}</TableCell>
                  <TableCell>{affiliateUrl.Description}</TableCell>
                  <TableCell className="flex flex-row">
                    <button
                      onClick={() =>
                        handleCopyToClipboard(
                          `${affiliateUrl.url}/register?ref=${affiliateUrl.affiliate_id}`
                        )
                      }
                      className="bg-gray-500 hover:bg-gray-700 text-white font-normal py-2 px-4 rounded mr-2"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={() =>
                        handleFetchBanners(
                          affiliateUrl.url_id,
                          affiliateUrl.url,
                          affiliateUrl.affiliate_id
                        )
                      }
                      className="bg-green-500 hover:bg-green-700 text-white font-normal py-2 px-4 rounded"
                    >
                      Consult Banners
                    </button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
      {showCopyMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white py-2 px-4 rounded shadow-md transition-opacity duration-300 ease-in-out z-50">
          URL copied to clipboard!
        </div>
      )}
      {showBannersModal && (
        <Modal onClose={handleBannerModalClose}>
          <div className="container mx-auto flex items-center justify-center ">
            <div className="w-full">
              <CardHeader>
                <CardTitle>Banners</CardTitle>
                <CardDescription>
                  Banners related to the selected URL.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-flow-col gap-4 justify-items-center">
                  {banners.map((banner: Banner) => (
                    <div
                      key={banner.id}
                      className="border border-gray-200 p-2 rounded"
                    >
                      <img src={banner.src} alt="" className="w-64 " />
                      <textarea
                        className="bg-gray-50 mt-2 p-2 h-20 w-full rounded resize-none select-none cursor-pointer"
                        readOnly
                        value={`<a href="${selectedUrl}?ref=${refId}" download="banner_image"><img src="${banner.src}" alt="Banner Image" /></a>`}
                        onClick={() => handleCopyImageUrl(banner.src)}
                      ></textarea>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
};

export default MyLinksPage;
