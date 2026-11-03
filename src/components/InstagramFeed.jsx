import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function InstagramFeed({ limit = 6, compact = false }) {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.functions.invoke('instagramFeed', {})
      .then(res => {
        setPosts((res.data.posts || []).slice(0, limit));
        setUsername(res.data.username || '');
      })
      .finally(() => setLoading(false));
  }, [limit]);

  if (loading) {
    return (
      <div className={`grid ${compact ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-6'} gap-1.5`}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-sm" />
        ))}
      </div>
    );
  }

  if (!posts.length) return null;

  return (
    <div>
      {!compact && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Instagram size={14} className="text-gold" />
            <span className="text-gold text-xs font-montserrat font-bold tracking-[0.25em] uppercase">
              {username ? `@${username}` : 'Instagram'}
            </span>
          </div>
          <a
            href={`https://www.instagram.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/30 hover:text-gold text-[10px] font-montserrat tracking-widest uppercase transition-colors duration-200"
          >
            Follow <ExternalLink size={9} />
          </a>
        </div>
      )}

      <div className={`grid ${compact ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-6'} gap-1.5`}>
        {posts.map((post, i) => (
          <motion.a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="relative aspect-square overflow-hidden rounded-sm group block"
          >
            <img
              src={post.media_url}
              alt={post.caption?.slice(0, 60) || 'Instagram post'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
              <Instagram
                size={compact ? 14 : 18}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
            {/* Gold border on hover */}
            <div className="absolute inset-0 border border-transparent group-hover:border-gold/40 transition-all duration-300 rounded-sm pointer-events-none" />
          </motion.a>
        ))}
      </div>
    </div>
  );
}