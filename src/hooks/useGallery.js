import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

// Fetch the Client record for the logged-in user by matching email
export function useClientRecord(userEmail) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) { setLoading(false); return; }
    base44.entities.Client.filter({ email: userEmail })
      .then((records) => {
        if (records && records.length > 0) setClient(records[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userEmail]);

  return { client, loading };
}

// Fetch the gallery assigned to the client by Client.id
export function useClientGallery(clientId) {
  const [gallery, setGallery] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) { setLoading(false); return; }
    base44.entities.Gallery.filter({ client_id: clientId })
      .then((gals) => {
        if (gals && gals.length > 0) {
          const sorted = [...gals].sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date));
          setGalleries(sorted);
          setGallery(sorted[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [clientId]);

  return { gallery, galleries, loading };
}

// Fetch proof images for a gallery
export function useProofImages(galleryId) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!galleryId) { setLoading(false); return; }
    base44.entities.GalleryImage.filter({ gallery_id: galleryId, image_type: 'proof' }, 'sort_order', 500)
      .then(setImages)
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [galleryId]);

  return { images, setImages, loading };
}

// Fetch final images for a gallery
export function useFinalImages(galleryId) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!galleryId) { setLoading(false); return; }
    base44.entities.GalleryImage.filter({ gallery_id: galleryId, image_type: 'final' }, 'sort_order', 500)
      .then(setImages)
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [galleryId]);

  return { images, loading };
}

// Fetch selections for a client+gallery
export function useSelections(clientId, galleryId) {
  const [selections, setSelections] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    if (!clientId || !galleryId) { setLoading(false); return; }
    base44.entities.ImageSelection.filter({ client_id: clientId, gallery_id: galleryId }, '-updated_date', 500)
      .then(setSelections)
      .catch(() => setSelections([]))
      .finally(() => setLoading(false));
  };

  useEffect(refresh, [clientId, galleryId]);

  const upsertSelection = async (imageId, updates) => {
    const existing = selections.find(s => s.image_id === imageId);
    if (existing) {
      await base44.entities.ImageSelection.update(existing.id, updates);
      setSelections(prev => prev.map(s => s.id === existing.id ? { ...s, ...updates } : s));
    } else {
      const created = await base44.entities.ImageSelection.create({
        image_id: imageId,
        client_id: clientId,
        gallery_id: galleryId,
        ...updates,
      });
      setSelections(prev => [...prev, created]);
      return created;
    }
  };

  return { selections, loading, upsertSelection, refreshSelections: refresh };
}