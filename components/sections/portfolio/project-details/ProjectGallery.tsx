"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ContainerLayout } from "@/components/layout";
import { 
  Dialog, 
  DialogContent, 
  DialogPortal, 
  DialogOverlay, 
  DialogTitle
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectGalleryProps {
  images: {
    url: string;
    alt?: string;
  }[];
}

export const ProjectGallery = ({ images }: ProjectGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handlePrevious = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev! - 1));
    }
  }, [selectedImageIndex, images?.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev === (images?.length || 0) - 1 ? 0 : prev! + 1));
    }
  }, [selectedImageIndex, images?.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setSelectedImageIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, handlePrevious, handleNext]);

  if (!images || images.length === 0) return null;

  const currentImage = selectedImageIndex !== null ? images[selectedImageIndex] : null;

  return (
    <section className="py-24 bg-muted/20 border-y border-border">
      <ContainerLayout>
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-bold mb-4 tracking-tight"
          >
            Project Gallery
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            A deeper look into the visual elements and creative process of this transformation.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {images.map((image, index) => (
            <motion.div
              key={image.url}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedImageIndex(index)}
              className="relative aspect-3/2 group cursor-zoom-in overflow-hidden rounded-2xl bg-muted border border-border shadow-sm hover:shadow-xl hover:border-accent/40 transition-all duration-500"
            >
              <Image
                src={image.url}
                alt={image.alt || `Project image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-90 group-hover:scale-100">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 text-white">
                        <Maximize2 className="w-5 h-5" />
                    </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ContainerLayout>

      {/* Lightbox Modal */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={(open) => !open && setSelectedImageIndex(null)}>
        <DialogPortal>
            <DialogOverlay className="bg-black/90 backdrop-blur-sm z-100" />
            <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl max-h-[95vh] p-0 border-none bg-transparent shadow-none z-101 outline-none sm:rounded-none">
            <DialogTitle>

         
            </DialogTitle>
                <AnimatePresence mode="wait">
                    {currentImage && (
                        <motion.div
                            key={currentImage.url}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full h-[85vh] flex items-center justify-center p-4 md:p-12"
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={currentImage.url}
                                    alt={currentImage.alt || "Gallery image"}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>

                            {/* Controls */}
                            <div className="absolute inset-y-0 left-4 md:left-8 flex items-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="bg-white/10 hover:bg-white/20 text-white rounded-full h-12 w-12 backdrop-blur-md border border-white/20 transition-all"
                                    onClick={handlePrevious}
                                >
                                    <ChevronLeft className="h-8 w-8" />
                                </Button>
                            </div>
                            <div className="absolute inset-y-0 right-4 md:right-8 flex items-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="bg-white/10 hover:bg-white/20 text-white rounded-full h-12 w-12 backdrop-blur-md border border-white/20 transition-all"
                                    onClick={handleNext}
                                >
                                    <ChevronRight className="h-8 w-8" />
                                </Button>
                            </div>

                            {/* Caption */}
                            {currentImage.alt && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
                                    <p className="text-white text-sm font-medium">{currentImage.alt}</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </DialogPortal>
      </Dialog>
    </section>
  );
};
