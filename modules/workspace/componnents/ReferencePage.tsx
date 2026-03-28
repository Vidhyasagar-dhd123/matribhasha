import React, { useEffect, useState } from "react";
import { Button } from "@/modules/shared/components/Button";
import { Card, CardContent } from "@/modules/shared/components/cards";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useReader } from "@/modules/books/contexts/read.context";
import ReadQueryManager from "@/modules/books/components/ReadQueryManager";
import { idToHeading } from "@/lib/utils";

export const OuterContainer = ({
    children,
    type,
    id,
}: {
    children: React.ReactNode;
    id: string;
    type: string;
}) => {
    const { page } = useReader();
    const [fontSize, setFontSize] = React.useState(16);
    const [openVersions, setOpenVersions] = useState(false);
    return (
        <div className="flex-1 md:p-4 md:w-1/2 min-h-0 w-full bg-background rounded-2xl">
            <Card className="max-w-4xl border md:h-[80svh] flex flex-col  h-[40svh]">
                <div className="flex items-center justify-between p-2 md:p-3 rounded-t-2xl relative">
                    <div className="flex items-center gap-2">
                        <Button variant="outline">
                            <ArrowLeft size={18} />
                        </Button>
                        <Button variant="outline">
                            <ArrowRight size={18} />
                        </Button>
                        <h2 className="ml-3  font-semibold [var(--secondary-foreground)] hidden sm:block">
                            {idToHeading(id)}
                        </h2>
                        <span className="ml-2">
                            Page: {page.data?.pageNumber}
                        </span>
                    </div>
                    {type == "ref"&& (
                        <>
                            <div onClick={()=>{setOpenVersions(!openVersions)}} className="flex items-center border hover: p-2 rounded px-3">
                                Versions
                            </div>

                            { openVersions &&
                              <div className="absolute flex items-center gap-3 right-0 w-full">
                                <div className="absolute top-10 flex overflow-y-auto max-h-100 right-0 rounded-2xl">
                                    <ReadQueryManager />
                                </div>
                            </div>}
                        </>
                    )}
                </div>

                <CardContent
                    className=" overflow-y-auto rounded-lg md:my-3 md:mx-4 md:p-5 text-justify border  flex-1 min-h-0"
                    style={{ fontSize }}
                >
                    {type === "ref" ? <ReferencePage id={id} /> : children}
                </CardContent>

                <div className="flex items-center justify-between p-3 rounded-b-2xl">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() =>
                                setFontSize((f) => Math.max(12, f - 1))
                            }
                        >
                            -
                        </Button>
                        <span className=" ">
                            Font: {fontSize}px
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => setFontSize((f) => f + 1)}
                        >
                            +
                        </Button>
                    </div>
                    {type === "edit" && (
                        <Button variant="default" onClick={handleSave}>Save Changes</Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export const ReferencePage = ({ id }: { id: string }) => {
    const { content, page, author, language,} = useReader();
    useEffect(() => {
        const getPageVersion = async () => {
            console.log(
                "Fetching Content : ",
                `/api/v1/pages/${page?.data?.bookUUID}/${page?.data?.pageNumber}`
            );

            const params = new URLSearchParams();
            if (author?.data?.authorId?.email)
                params.append("author", author?.data?.authorId?.email);
            if (language?.data) params.append("language", language?.data);

            const query = params.toString() ? `?${params.toString()}` : "";

            const data = await fetch(
                `/api/v1/pages/${page?.data?.bookUUID}/${page?.data?.pageNumber}${query}`
            );
            if (data.ok) {
                const requested_page = await data.json();
                content.set(requested_page);
                console.log("Fetched Data : ", requested_page);
            }
        };
        if (page?.data?.bookUUID) getPageVersion();
    }, [page?.data, author?.data, language?.data]);
    return <p className="mt-2">{content.data?.content}</p>;
};

const handleSave = async () => {
    // Implement save functionality here
    alert("Save functionality is not implemented yet.");
}
