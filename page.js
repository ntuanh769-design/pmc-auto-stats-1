"use client";
import { useEffect, useState } from 'react'; // Bỏ useRef vì không dùng nữa
import { supabase } from '@/lib/supabase';
// Import các thành phần biểu đồ
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, Tooltip, Legend 
} from 'recharts';
import { 
  Play, Users, TrendingUp, Youtube, Facebook, 
  Instagram, Music, CheckCircle2, Clock, MessageCircle, ThumbsUp, 
  Loader2, MapPin, CalendarDays, Star, ExternalLink, 
  ChevronLeft, ChevronRight, ArrowRight
} from 'lucide-react';

// --- CẤU HÌNH LIÊN KẾT & VIDEO ---
const VIDEO_URLS = [
  'https://www.youtube.com/watch?v=sZrIbpwjTwk', // Éch Ngồi Đáy Giếng
  'https://www.youtube.com/watch?v=BmrdGQ0LRRo', // Chiếc Lược Ngà
  'https://www.youtube.com/watch?v=V1ah6tmNUz8', // Bóng Phù Hoa
  'https://www.youtube.com/watch?v=SmXQf8_6bV4', // Đẩy Xe Bò
  'https://www.youtube.com/watch?v=Z8JT5TNxmVE', // Vũ Trụ Có Anh
  'https://www.youtube.com/watch?v=Jq3_WjV7tZk', // Hai Đứa Trẻ
  'https://www.youtube.com/watch?v=4SFEYNJyYaE', // Gối Gấm
  'https://www.youtube.com/watch?v=cU1GSszAVi4', // Mashup Túy Âm
];

const SOCIAL_LINKS = {
  facebook: "https://facebook.com/phuongmychi",
  youtube: "https://youtube.com/@PhuongMyChiOfficial",
  spotify: "https://open.spotify.com/artist/1BcjfrXV4Oe3fK0c8dnxFF", 
  instagram: "https://www.instagram.com/phuongmychi/" 
};

const YOUTUBE_API_KEY = "AIzaSyAueu53W-r0VWcYJwYrSSboOKuWYQfLn34"; 

// Dữ liệu Spotify
const SPOTIFY_DATA = [
  { id: 1, title: "Vũ Trụ Có Anh", artists: "Phương Mỹ Chi, DTAP, Pháo", duration: "03:40", link: "https://open.spotify.com/track/4bOwnJwm4Zy1vjnndHFLHj?si=5c9a5bc7425a4b9d" },
  { id: 2, title: "Bóng Phù Hoa", artists: "Phương Mỹ Chi, DTAP", duration: "04:34", link: "https://open.spotify.com/track/3fw9v7CztM2mqu1jCtbg9f?si=ace149bcfd954d2a" },
  { id: 3, title: "Gối Gấm", artists: "Phương Mỹ Chi, DTAP", duration: "03:16", link: "https://open.spotify.com/track/211PBKJlAG1CxXUEjN5nqq?si=f356489962934e4e" },
  { id: 4, title: "Đẩy Xe Bò", artists: "Phương Mỹ Chi, DTAP", duration: "02:45", link: "https://open.spotify.com/track/513yY4zlOPYCAnqH614sl1?si=e48c22d434544c13" },
  { id: 5, title: "Ếch Ngoài Đáy Giếng", artists: "Phương Mỹ Chi", duration: "03:52", link: "https://open.spotify.com/album/3BGhIjI8DZUSqwAC8u2kka?si=nOD4amt0TMG_gzsX1AbJeQ" },
];

// Dữ liệu Hành trình (Dùng cho Tab Giới thiệu)
const MILESTONES = [
  {
    id: 1,
    year: "2013",
    date: "07/09/2013",
    category: "THE DEBUT",
    title: "Á QUÂN GIỌNG HÁT VIỆT NHÍ",
    desc: "Phương Mỹ Chi bắt đầu hành trình âm nhạc khi tham gia Giọng Hát Việt Nhí mùa đầu tiên. Với chất giọng dân ca ngọt ngào, cô bé đã chinh phục hàng triệu trái tim khán giả và giành ngôi vị Á quân, mở ra kỷ nguyên mới cho dòng nhạc dân gian đương đại.",
    image: "https://thanhnien.mediacdn.vn/Uploaded/2014/Pictures20136/PhuongThanh/ghvn2/mychi1.JPG"
  },
  {
    id: 2,
    year: "2023",
    date: "18/09/2023",
    category: "NEW ERA",
    title: "ALBUM VŨ TRỤ CÒ BAY",
    desc: "Đánh dấu sự lột xác ngoạn mục thoát khỏi hình ảnh 'cô bé dân ca', Phương Mỹ Chi ra mắt album 'Vũ Trụ Cò Bay' kết hợp giữa văn học Việt Nam và các chất liệu âm nhạc hiện đại (Disco, Folktronica), khẳng định tư duy nghệ thuật đột phá của Gen Z.",
    image: "https://i.scdn.co/image/ab67616d0000b27371dea61e1ce07e18c746d775"
  },
  {
    id: 3,
    year: "2024",
    date: "10/01/2024",
    category: "ACHIEVEMENT",
    title: "GIẢI THƯỞNG LÀN SÓNG XANH",
    desc: "Tại lễ trao giải Làn Sóng Xanh 2023, Phương Mỹ Chi đã chiến thắng hạng mục 'Gương mặt mới xuất sắc', đây là minh chứng cho sự công nhận của giới chuyên môn và khán giả đối với những nỗ lực không ngừng nghỉ của Chi trong suốt một thập kỷ.",
    image: "https://cdnphoto.dantri.com.vn/KHkLPKrVKtmQzp-sCm80B5apfRw=/thumb_w/1020/2024/01/25/moment136-1706139576419.jpg"
  },
  {
    id: 4,
    year: "2025",
    date: "21/02/2025",
    category: "ACHIEVEMENT",
    title: "PHIM ĐIỆN ẢNH 'NHÀ GIA TIÊN'",
    desc: "Với vai diễn trong bộ phim điện ảnh Nhà Gia Tiên ra mắt vào ngày 23/02/2024, Phương Mỹ Chi đã có bước chuyển mình đáng chú ý khi thử sức ở lĩnh vực điện ảnh. Sự thể hiện tròn vai, giàu cảm xúc của Chi cho thấy khả năng biến hóa và tinh thần nghiêm túc với nghệ thuật, qua đó khẳng định hình ảnh một nghệ sĩ trẻ không ngừng học hỏi và mở rộng giới hạn bản thân.",
    image: "https://cdn2.tuoitre.vn/471584752817336320/2025/2/18/image001-1-resize-1739880121041644544719.jpg"
  },
  {
    id: 5,
    year: "2025",
    date: "18/07/2025",
    category: "ACHIEVEMENT",
    title: "QUÝ QUÂN SING ASIA",
    desc: "Tại đêm Chung kết chương trình Sing Asia diễn ra ngày 18/07/2025, Phương Mỹ Chi đã xuất sắc giành danh hiệu Quý quân. Thành tích này đánh dấu cột mốc quan trọng trong hành trình vươn ra sân chơi âm nhạc khu vực, đồng thời là minh chứng cho năng lực chuyên môn, bản lĩnh sân khấu và khả năng lan tỏa âm nhạc mang bản sắc Việt Nam đến khán giả quốc tế.",
    image: "https://vstatic.vietnam.vn/vietnam/resource/IMAGE/2025/6/27/6c1b237300c84b39a4c178ab142f31d7"
  },
  {
    id: 6,
    year: "2025",
    date: "23/09/2025",
    category: "ACHIEVEMENT",
    title: "QUÁN QUÂN EM XINH SAY HI",
    desc: "Chiến thắng ngôi vị Quán quân chương trình Em Xinh Say Hi là sự ghi nhận xứng đáng cho hành trình nỗ lực, bền bỉ và không ngừng đổi mới của Phương Mỹ Chi. Qua chương trình, Chi cho thấy sự trưởng thành rõ nét trong tư duy âm nhạc, cá tính nghệ sĩ và khả năng kết nối với khán giả trẻ, củng cố vị trí vững chắc trong thế hệ nghệ sĩ Gen Z.",
    image: "https://cdn.giaoducthoidai.vn/images/a9c03e1761dda818fc463abc1a45d96f28b7ebbeefc60e0f56f295b46ce3b313ab47f1e8bbb0b8ba36a3a7145f53dc39/phuong-my-chi-1.jpg"
  }
];

const getVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};
const formatCompact = (num) => new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [stats, setStats] = useState([]);
  const [videoStats, setVideoStats] = useState([]); 
  const [spotifyChartData, setSpotifyChartData] = useState([]);
  const [latest, setLatest] = useState({ view: 0, sub: 0 });
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  
  // Slider State
  const [slideIndex, setSlideIndex] = useState(0);
  const nextSlide = () => setSlideIndex((prev) => (prev + 1) % MILESTONES.length);
  const prevSlide = () => setSlideIndex((prev) => (prev - 1 + MILESTONES.length) % MILESTONES.length);

  // --- FETCH DATA (SUPABASE) ---
  useEffect(() => {
    const fetchSupabaseData = async () => {
      // 1. YouTube Tổng
      const { data: channelData } = await supabase.from('pmc_stats').select('*').order('created_at', { ascending: true }).limit(100);
      if (channelData && channelData.length > 0) {
        setStats(channelData.filter(i => i.metric_type === 'view_count').map(i => ({ value: i.value, date: new Date(i.created_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) })));
        setLatest({
          view: channelData.filter(i => i.metric_type === 'view_count').pop()?.value || 0,
          sub: channelData.filter(i => i.metric_type === 'subscriber_count').pop()?.value || 0
        });
      }

      // 2. YouTube Video Chi Tiết
      const { data: vData } = await supabase.from('pmc_video_stats').select('*').order('created_at', { ascending: false }).limit(50);
      
      if (vData) {
        const uniqueVideos = [];
        const map = new Map();
        for (const item of vData) {
            if(!map.has(item.video_id)) {
                map.set(item.video_id, true);
                uniqueVideos.push({
                    name: item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title,
                    fullTitle: item.title,
                    views: item.view_count,
                    likes: item.like_count,
                    comments: item.comment_count
                });
            }
        }
        setVideoStats(uniqueVideos); // <-- Đã đặt vào đúng chỗ, hết lỗi
      }

      // 3. Spotify Stats
      const { data: sData } = await supabase.from('pmc_spotify_stats').select('*').order('streams', { ascending: false });
      if (sData) {
        setSpotifyChartData(sData);
      }
    };
    fetchSupabaseData();
  }, []);

  // --- FETCH YOUTUBE API (HIỂN THỊ VIDEO) ---
  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const ids = VIDEO_URLS.map(url => getVideoId(url)).filter(id => id).join(',');
        const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${ids}&key=${YOUTUBE_API_KEY}`);
        const data = await res.json();
        if (data.items) {
          const formattedVideos = data.items.map(item => ({
            id: item.id,
            title: item.snippet.title,
            thumb: item.snippet.thumbnails.maxres ? item.snippet.thumbnails.maxres.url : item.snippet.thumbnails.high.url,
            views: formatCompact(item.statistics.viewCount),
            likes: formatCompact(item.statistics.likeCount),
            comments: formatCompact(item.statistics.commentCount),
            link: `https://www.youtube.com/watch?v=${item.id}`
          }));
          setVideos(formattedVideos);
        }
      } catch (error) { console.error(error); } finally { setLoadingVideos(false); }
    };
    if (YOUTUBE_API_KEY && !YOUTUBE_API_KEY.includes("DÁN")) fetchVideoDetails();
    else {
      setVideos(VIDEO_URLS.map((url, index) => ({
        id: index, title: "Video Youtube (Cần API Key)", views: "1.2M", likes: "50K", comments: "2K", thumb: `https://img.youtube.com/vi/${getVideoId(url)}/maxresdefault.jpg`, link: url
      })));
      setLoadingVideos(false);
    }
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'about':
        const item = MILESTONES[slideIndex];
        return (
          <div className="animate-fade-in w-full bg-[#0a0a0a] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative min-h-[650px] flex flex-col md:flex-row">
            <div className="w-full md:w-[45%] relative p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800 bg-black/40">
               <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-zinc-700/50 group">
                 <img key={item.image} src={item.image} className="w-full h-full object-cover animate-fade-in transition-transform duration-700 group-hover:scale-105" alt={item.title} />
               </div>
               <div className="absolute top-4 left-6 text-6xl font-serif text-white/5 font-bold pointer-events-none select-none">Fig. {item.id}</div>
            </div>
            <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center relative">
               <div className="flex items-center gap-3 text-xs tracking-[0.2em] text-pmc-gold font-bold mb-6 uppercase">
                  <span className="bg-pmc-gold text-black px-2 py-1">Exclusive</span><span>Introduction / Page 0{item.id}</span>
               </div>
               <h2 key={item.title} className="text-3xl md:text-5xl font-serif font-bold !text-white mb-4 leading-tight animate-fade-in">{item.title}</h2>
               <p className="text-xl text-gray-500 font-serif italic mb-8 animate-fade-in">({item.date})</p>
               <div className="prose prose-invert max-w-none mb-10"><p key={item.desc} className="!text-gray-300 text-lg leading-relaxed font-light animate-fade-in">{item.desc}</p></div>
               <div className="flex items-center gap-4 mt-8 border-t border-zinc-800 pt-6">
                  <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all"><ChevronLeft size={20} /></button>
                  <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all"><ChevronRight size={20} /></button>
                  <span className="ml-4 text-xs text-gray-500 tracking-widest font-mono">{String(slideIndex + 1).padStart(2, '0')} — {String(MILESTONES.length).padStart(2, '0')}</span>
               </div>
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="animate-fade-in flex justify-center">
             <div className="max-w-4xl w-full bg-zinc-900 p-2 rounded-2xl shadow-xl overflow-hidden border border-zinc-800">
              <img src="https://scontent.fsgn2-10.fna.fbcdn.net/v/t39.30808-6/616157956_1332069402299119_1295986647605451446_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=BWqZmoQMt4oQ7kNvwEo0fhW&_nc_oc=Adngx7Lozo2jel3J8VKM3P73P7l9dYzRwaffm-pJlj1xlr3VFjd7AJPwp8PNGPRHqVkGT2OkhviXDGtDjEQx3qzj&_nc_zt=23&_nc_ht=scontent.fsgn2-10.fna&_nc_gid=RtQJ9gQ__vSFDPOth6RNfw&oh=00_Afqekk2TxWUDsH3Kxl_Yp7paeAXBLW885XYxBZyrnJD2FQ&oe=69719571" className="w-full rounded-xl" alt="Lịch trình" />
            </div>
          </div>
        );
      
      case 'stats':
        return (
            <div className="animate-fade-in space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Biểu đồ 1 */}
                    <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-sm">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white"><TrendingUp className="text-red-500"/> Total Channel Growth</h3>
                        <div className="h-72 w-full">
                          <ResponsiveContainer>
                            <AreaChart data={stats}>
                              <defs><linearGradient id="colorView" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient></defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                              <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} />
                              <YAxis stroke="#666" fontSize={12} tickFormatter={(val)=>`${(val/1000000).toFixed(1)}M`} tickLine={false} />
                              <Tooltip contentStyle={{backgroundColor: '#18181b', border: '1px solid #333', color: '#fff'}} />
                              <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorView)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Biểu đồ 2 */}
                    <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-sm">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white"><Play className="text-pmc-gold"/> Top Videos Performance</h3>
                        <div className="h-72 w-full">
                          <ResponsiveContainer>
                            <BarChart data={videoStats} layout="vertical" margin={{left: 20}}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={true} vertical={false} />
                              <XAxis type="number" stroke="#666" fontSize={12} tickFormatter={(val)=>`${(val/1000000).toFixed(1)}M`} />
                              <YAxis dataKey="name" type="category" stroke="#fff" fontSize={11} width={100} />
                              <Tooltip 
                                cursor={{fill: '#33333333'}}
                                contentStyle={{backgroundColor: '#18181b', border: '1px solid #D4AF37', color: '#fff'}} 
                                formatter={(value) => new Intl.NumberFormat('en-US').format(value)}
                              />
                              <Bar dataKey="views" fill="#D4AF37" radius={[0, 4, 4, 0]} barSize={20} name="Lượt xem" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Biểu đồ 3: Spotify */}
                <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white"><Music className="text-[#1DB954]"/> Spotify Most Streamed Tracks</h3>
                    <div className="h-80 w-full">
                      <ResponsiveContainer>
                        <BarChart data={spotifyChartData} layout="vertical" margin={{left: 40}}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={true} vertical={false} />
                          <XAxis type="number" stroke="#666" fontSize={12} tickFormatter={(val)=>`${(val/1000000).toFixed(1)}M`} />
                          <YAxis dataKey="title" type="category" stroke="#fff" fontSize={12} width={150} />
                          <Tooltip 
                            cursor={{fill: '#33333333'}}
                            contentStyle={{backgroundColor: '#18181b', border: '1px solid #1DB954', color: '#fff'}} 
                            formatter={(value) => new Intl.NumberFormat('en-US').format(value)}
                          />
                          <Bar dataKey="streams" fill="#1DB954" radius={[0, 4, 4, 0]} barSize={25} name="Lượt nghe" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );

      default: 
        return (
          <div className="space-y-12 animate-fade-in">
            {/* SOCIAL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-red-500/10 text-red-500 rounded-xl"><Youtube size={28} /></div>
                  <span className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-1 rounded-full animate-pulse">LIVE</span>
                </div>
                <div className="mt-4">
                  <p className="text-gray-400 text-sm font-semibold">Total Channel Views</p>
                  <h3 className="text-4xl font-serif font-bold text-white">{formatCompact(latest.view)}</h3>
                </div>
              </div>
              <div className="md:col-span-2 bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-sm relative overflow-hidden">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><TrendingUp size={20} className="text-yellow-500"/> Real-time Growth</h3>
                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats}>
                      <defs><linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/><stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/></linearGradient></defs>
                      <Tooltip contentStyle={{backgroundColor: '#18181b', border: '1px solid #333', color: '#fff'}} itemStyle={{color: '#D4AF37'}}/>
                      <Area type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={2} fill="url(#goldGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* YOUTUBE VIDEOS (ĐÃ BỎ AUTO SCROLL, CHUYỂN VỀ GRID) */}
            <div>
              <h3 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-2 border-l-4 border-red-600 pl-4">Latest Videos</h3>
              {loadingVideos ? (<div className="flex justify-center py-12 text-gray-500"><Loader2 className="animate-spin" size={32}/></div>) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <a href={video.link} target="_blank" key={video.id} className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-sm hover:border-pmc-gold/50 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="relative aspect-video overflow-hidden">
                        <img src={video.thumb} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Play size={48} className="fill-white text-white drop-shadow-xl" /></div>
                      </div>
                      <div className="p-5">
                        <h4 className="text-white font-bold line-clamp-2 mb-3 group-hover:text-pmc-gold transition text-lg leading-tight h-[3.5rem]">{video.title}</h4>
                        <div className="flex justify-between text-xs text-gray-400 font-mono border-t border-zinc-800 pt-3">
                          <span className="flex items-center gap-1 hover:text-white"><Users size={14}/> {video.views}</span>
                          <span className="flex items-center gap-1 hover:text-white"><ThumbsUp size={14}/> {video.likes}</span>
                          <span className="flex items-center gap-1 hover:text-white"><MessageCircle size={14}/> {video.comments}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* SPOTIFY */}
            <div className="bg-gradient-to-b from-zinc-800 to-black rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden relative border border-zinc-800">
               <div className="absolute top-0 right-0 p-32 bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>
              <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6 relative z-10">
                <div className="flex items-center gap-6">
                  <img src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/481273200_1174366937390859_3228512912651874808_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=difjX_UmciwQ7kNvwE3euql&_nc_oc=AdmCFM5mYvEX7eN4p1h53o_xO_1QJRhmMEkOGeE0GsjOynEfCeBY-567qg1HkLO9xwUGFKS3re2VwXrB1CUjeePY&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=LczaYZsQz65JCWZuJDbPVQ&oh=00_AfrIdkDq_au9MQAdOL3rBHyYhYmfZerF1XR6lZDqfhxVfA&oe=69724A88" className="w-24 h-24 md:w-32 md:h-32 shadow-2xl rounded-lg" alt="Album Art" />
                  <div>
                    <span className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1 block">Spotify Verified</span>
                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-2 tracking-tight">PHƯƠNG MỸ CHI</h2>
                    <p className="text-gray-400 text-sm font-bold">461,646 monthly listeners</p>
                  </div>
                </div>
                <a href={SOCIAL_LINKS.spotify} target="_blank" className="bg-[#1DB954] text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition shadow-lg flex items-center gap-2"><Play fill="black" size={20}/> FOLLOW</a>
              </div>
              <div className="space-y-1 relative z-10">
                {SPOTIFY_DATA.map((track, idx) => (
                  <a key={track.id} href={track.link} target="_blank" className="group flex items-center py-3 px-4 rounded-lg hover:bg-white/10 transition cursor-pointer">
                    <span className="w-8 text-gray-500 group-hover:text-[#1DB954] font-mono">{idx + 1}</span>
                    <div className="flex-1">
                      <p className="text-white font-bold group-hover:text-[#1DB954] transition">{track.title}</p>
                      <p className="text-gray-400 text-xs">{track.artists}</p>
                    </div>
                    <span className="text-gray-500 text-sm font-mono">{track.duration}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-black font-sans text-white selection:bg-pmc-gold selection:text-black">
      <div className="bg-black shadow-sm pb-0 border-b border-zinc-800">
        <div className="w-full relative bg-zinc-900">
          <img src="https://scontent.fsgn2-4.fna.fbcdn.net/v/t39.30808-6/615815805_1580171003134180_7447896336286227545_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=vO3ptD-NJnQQ7kNvwGLby2Y&_nc_oc=AdmtfcipBNIjeBpuBpfKGm-zXwph3jUSOm1kGypo-d48B-Gv3wtNzbmFMsFH1cxdYEcx6Wc47nW868NRFrxkoktN&_nc_zt=23&_nc_ht=scontent.fsgn2-4.fna&_nc_gid=xjKBbNiUdinEY6AKK8lH_g&oh=00_AfrG8BpYnsimzHLWgcwL1DBITG2buxQ4YzNrWFak5qHVnw&oe=697244ED" className="w-full h-auto block opacity-80" alt="Banner" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="relative -mt-20 md:-mt-24 z-10">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full p-1 bg-black shadow-2xl relative">
                <img src="https://scontent.fvca1-1.fna.fbcdn.net/v/t39.30808-6/482242951_1184903749670511_116581152088062484_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=105&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeHl6z1Zf722SPdydZ2cSXjkZpHk_q-4D51mkeT-r7gPndTlCsa2S-9POMvKIBb4ckII1tv_ascEHrs3kes9q9GO&_nc_ohc=0KAgPDwqVoYQ7kNvwGvYZzT&_nc_oc=AdkiSSI5Nm1z4L60wjOWhF2RlhO42CTckj5fJghrGNCIl1rRcnH9YUwQDlrcIYwvWshnvTSvZ0pqlV2sGzg6tPGG&_nc_zt=23&_nc_ht=scontent.fvca1-1.fna&_nc_gid=VKwmNPd5x84LUuWGX44UBw&oh=00_AfpI8odqVyRf4fYhFFiablQhci6WR8tZfRwbNfW2uoUEig&oe=696F885F" className="w-full h-full rounded-full object-cover border-4 border-black" alt="Avatar" />
              </div>
            </div>
            <div className="flex-1 text-center pt-2">
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2 flex items-center justify-center gap-2">Phương Mỹ Chi <CheckCircle2 size={28} fill="#3b82f6" className="text-white inline drop-shadow-sm"/></h1>
              <p className="text-gray-400 font-medium text-lg max-w-2xl mx-auto">"Cô bé dân ca" ngày nào giờ đã trở thành một biểu tượng âm nhạc trẻ trung, năng động và đầy sáng tạo.</p>
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <a href={SOCIAL_LINKS.facebook} target="_blank" className="px-6 py-3 bg-[#1877F2] text-white rounded-full font-bold hover:brightness-110 flex items-center gap-2 shadow-lg transition hover:-translate-y-1"><Facebook size={20}/> Follow</a>
                <a href={SOCIAL_LINKS.youtube} target="_blank" className="p-3 bg-zinc-800 rounded-full hover:bg-red-600 text-white transition border border-zinc-700 hover:-translate-y-1"><Youtube size={24} /></a>
                <a href={SOCIAL_LINKS.spotify} target="_blank" className="p-3 bg-zinc-800 rounded-full hover:bg-green-500 text-white transition border border-zinc-700 hover:-translate-y-1"><Music size={24} /></a>
                <a href={SOCIAL_LINKS.instagram} target="_blank" className="p-3 bg-zinc-800 rounded-full hover:bg-pink-600 text-white transition border border-zinc-700 hover:-translate-y-1"><Instagram size={24} /></a>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-8 border-t border-zinc-800 mt-6">
            {[{id: 'home', label: 'Trang Chủ'}, {id: 'about', label: 'Giới Thiệu'}, {id: 'schedule', label: 'Lịch Trình'}, {id: 'stats', label: 'Thống Kê'}].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-4 px-2 font-bold text-sm uppercase tracking-wider border-b-4 transition-all ${activeTab === tab.id ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-gray-500 hover:text-white hover:border-zinc-700'}`}>{tab.label}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">{renderContent()}</div>
      <footer className="border-t border-zinc-800 bg-black py-12 text-center mt-12">
        <h2 className="font-bold text-xl text-pmc-gold mb-2">© 2026 Developed by NhinhanhinhocungMyChi</h2>
        <p className="text-gray-600 text-sm">Official Fan Hub</p>
      </footer>
    </main>
  );
}