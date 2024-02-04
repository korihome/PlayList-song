const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORSGE_KEY = 'PLAYER_SETTING'

let playBtn = $('.player')

const app = {
    CurrentSong: 0,
    IsRepeat: false,
    IsRandom: false,

    //Giá trị lưu cấu hình để làm việc với local storage
    configs: JSON.parse(localStorage.getItem(PLAYER_STORSGE_KEY)) || {},

    //Ghi nhớ 1 số cấu hình vào local storage
    SetConfigs(key, value) {
        this.configs[key] = value
        localStorage.setItem(PLAYER_STORSGE_KEY, JSON.stringify(this.configs))
    },

    //Lấy cấu hình ra từ local storage
    GetConfigs() {
        $('#progress').value = this.configs['TimeNow'] || 0
        this.CurrentSong = this.configs['CurrentSong'] || 0
        this.IsRepeat = this.configs['IsRepeat'] || false
        this.IsRandom = this.configs['IsRandom'] || false
    },

    songs: [
        // {
        //     song: 'Bai 1',
        //     singer: 'Remix 1',
        //     linkMusic: './music/nhacxuan/b1.mp3',
        //     linkPic: './img/anhxuan/a1.jpg'
        // },
        // {
        //     song: 'Bai 2',
        //     singer: 'Remix 2',
        //     linkMusic: './music/nhacxuan/b2.mp3',
        //     linkPic: './img/anhxuan/a2.jpg'
        // },
        // {
        //     song: 'Bai 3',
        //     singer: 'Remix 3',
        //     linkMusic: './music/nhacxuan/b3.mp3',
        //     linkPic: './img/anhxuan/a3.jpg'
        // },
        // {
        //     song: 'Bai 4',
        //     singer: 'Remix 4',
        //     linkMusic: './music/nhacxuan/b4.mp3',
        //     linkPic: './img/anhxuan/a4.jpg'
        // }
        {
            song: 'Nevada',
            singer: 'Vicetone',
            linkMusic: './music/1.mp3',
            linkPic: './img/mqdefault1.jpg'
        },
        {
            song: 'Summertime',
            singer: 'K-391',
            linkMusic: './music/2.mp3',
            linkPic: './img/mqdefault2.jpg'
        },
        {
            song: 'TheFatRat',
            singer: 'Laura Brehm',
            linkMusic: './music/3.mp3',
            linkPic: './img/mqdefault3.jpg'
        },
        {
            song: 'Lost Frequencies',
            singer: 'Janieck Devy - Reality',
            linkMusic: './music/4.mp3',
            linkPic: './img/mqdefault4.jpg'
        },
        {
            song: 'Lemon Tree',
            singer: 'DJ DESA REMIX',
            linkMusic: './music/5.mp3',
            linkPic: './img/mqdefault5.jpg'
        },
        {
            song: 'Sugar',
            singer: 'Maroon 5',
            linkMusic: './music/6.mp3',
            linkPic: './img/mqdefault6.jpg'
        },
        {
            song: 'My love',
            singer: 'Westlife',
            linkMusic: './music/7.mp3',
            linkPic: './img/mqdefault7.jpg'
        },
        {
            song: 'Attention',
            singer: 'Charlie Puth',
            linkMusic: './music/8.mp3',
            linkPic: './img/mqdefault8.jpg'
        },
    ],

    //Render danh sách bài hát
    RenderSongsList() {
        let html = '';
        this.songs.forEach((item, index) => {
            html += `
                <div class="song">
                    <div class="thumb" style="background-image: url('${item.linkPic}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${item.song}</h3>
                        <p class="author">${item.singer}</p>
                    </div>
                </div>
                `
        });
        $('.playlist').innerHTML = html
    },

    //Xử lý sự kiện active cho bài hát đang chạy
    HandleActive_Song() {
        if ($('.song.active')) {
            $('.song.active').classList.remove('active')
        }
        [...$$('.song')].forEach((item, index) => {
            if (index == this.CurrentSong) {
                item.classList.add('active')
            }
        })
    },

    //Xử lý các sự kiện của trình duyệt: lăn chuột.....
    HandleEvent() {
        const _this = this
        let Cd = $('.cd')
        let CdWidth = Cd.offsetWidth
        document.onscroll = () => {
            let ClienWidth = window.scrollY | document.documentElement.scrollTop
            let NewWidth = CdWidth - ClienWidth

            Cd.style.width = NewWidth > 0 ? NewWidth + 'px' : 0
            Cd.style.opacity = NewWidth / CdWidth
        }

        //Xử lý quay / dừng CD
        let cd = $('.cd-thumb')
        let AnimationCD = cd.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        AnimationCD.pause()


        $('#audio').onplay = () => {
            AnimationCD.play()
            this.SetConfigs('CurrentSong', this.CurrentSong)
        }

        $('#audio').onpause = () => {
            AnimationCD.pause()
        }

        $('#audio').ontimeupdate = (() => {
            if ($('#audio').duration) {
                $('#progress').value = Math.floor($('#audio').currentTime / $('#audio').duration * 1000)
            }
            this.SetConfigs('TimeNow', $('#progress').value)
        })

        $('#audio').onended = (() => {
            if (_this.IsRepeat) {
                $('#audio').play()
            }
            else if (_this.IsRandom) {
                _this.Random_CurrentSong()
            }
            else {
                _this.Increase_CurrentSong()
            }
            this.HandleActive_Song()
        })
    },

    //Render bài hát đầu danh sách lên dashboard
    RenderDashboard() {
        $('header h2').innerHTML = this.songs[this.CurrentSong].song
        $('.cd .cd-thumb').style.backgroundImage = `url('${this.songs[this.CurrentSong].linkPic}')`
        $('#audio').src = `${this.songs[this.CurrentSong].linkMusic}`
    },

    //Xử lý sự kiện chọn nhạc
    HandleLoadSong() {
        let playList = $$('.song');
        playList.forEach((item, index) => {
            item.onclick = () => {
                if (index !== this.CurrentSong) {
                    let playBtn = $('.player')
                    if (!playBtn.classList.contains("playing")) {
                        playBtn.classList.add('playing')
                    }
                    this.CurrentSong = index
                    this.RenderDashboard()
                    this.HandleActive_Song()
                    $('#audio').play()
                }
            }
        });
    },

    //Tăng CurrentSong
    Increase_CurrentSong() {
        this.CurrentSong++
        if (this.CurrentSong == this.songs.length) {
            this.CurrentSong = 0
        }
        this.RenderDashboard()
        if (!playBtn.classList.contains("playing")) {
            playBtn.classList.add('playing')
        }
        $('#audio').play()
    },

    //Giảm CurrentSong
    Decrease_CurrentSong() {
        this.CurrentSong--
        if (this.CurrentSong == -1) {
            this.CurrentSong = this.songs.length - 1
        }
        this.RenderDashboard()
        if (!playBtn.classList.contains("playing")) {
            playBtn.classList.add('playing')
        }
        $('#audio').play()
    },

    //Chon ngau nhien CurrentSong
    Random_CurrentSong() {
        let newCurrentSong = Math.floor(Math.random() * this.songs.length)
        while (newCurrentSong == this.CurrentSong) {
            newCurrentSong = Math.floor(Math.random() * this.songs.length)
        }
        this.CurrentSong = newCurrentSong
        this.RenderDashboard()
        if (!playBtn.classList.contains("playing")) {
            playBtn.classList.add('playing')
        }
        $('#audio').play()
    },

    //Xử lý sự kiện phát nhạc - tắt nhạc
    HandlePlay_Pause() {
        $('.btn-toggle-play').onclick = () => {
            let playBtn = $('.player')
            playBtn.classList.toggle('playing')

            if (playBtn.classList.contains("playing")) {
                $('#audio').play()
                $('#audio').currentTime = Math.floor($('#progress').value / 1000 * $('#audio').duration) + 0.5
            }
            else {
                $('#audio').pause()
            }
        }
    },

    //Xử lý sự kiện chuyển tới bài trước hoặc sau
    HandleLoadPre_Next() {
        $('.btn-next').onclick = () => {
            if (this.IsRandom) {
                this.Random_CurrentSong()
            }
            else {
                this.Increase_CurrentSong();
            }
            this.HandleActive_Song()
        }

        $('.btn-prev').onclick = () => {
            if (this.IsRandom) {
                this.Random_CurrentSong()
            }
            else {
                this.Decrease_CurrentSong();
            }
            this.HandleActive_Song()
        }
    },

    //Xử lý sự kiện tua nhạc
    HandleRangeTime() {
        let range = $('#progress')
        range.addEventListener('input', () => {
            $('#audio').currentTime = Math.floor(range.value / 1000 * $('#audio').duration)
            $('.player').classList.add('playing')
            $('#audio').play()
        })
    },

    //Xử lý sự kiện đổi màu nút random và repeat và logic khi đổi bài
    HandleBtnRandom_Repeat() {
        let RepeatBtn = $('.btn-repeat')
        let RandomBtn = $('.btn-random')

        if (this.IsRepeat) {
            RepeatBtn.style.color = "#ec1f55"
        }

        if (this.IsRandom) {
            RandomBtn.style.color = "#ec1f55"
        }

        RepeatBtn.onclick = () => {
            if (this.IsRepeat == false) {
                this.IsRepeat = true
                RepeatBtn.style.color = "#ec1f55"

                if (this.IsRandom == true) {
                    this.IsRandom = false
                    RandomBtn.style.color = "#666"
                }

                this.SetConfigs('IsRepeat', this.IsRepeat)
                this.SetConfigs('IsRandom', this.IsRandom)
            }
            else {
                this.IsRepeat = false
                RepeatBtn.style.color = "#666"
                this.SetConfigs('IsRepeat', this.IsRepeat)
            }
        }

        RandomBtn.onclick = () => {
            if (this.IsRandom == false) {
                this.IsRandom = true
                RandomBtn.style.color = "#ec1f55"

                if (this.IsRepeat == true) {
                    this.IsRepeat = false
                    RepeatBtn.style.color = "#666"
                }

                this.SetConfigs('IsRepeat', this.IsRepeat)
                this.SetConfigs('IsRandom', this.IsRandom)
            }
            else {
                this.IsRandom = false
                RandomBtn.style.color = "#666"
                this.SetConfigs('IsRandom', this.IsRandom)
            }
        }
    }

    , start() {
        this.HandleEvent()
        this.GetConfigs()
        this.RenderSongsList()
        this.RenderDashboard()
        this.HandlePlay_Pause()
        this.HandleLoadSong()
        this.HandleLoadPre_Next()
        this.HandleRangeTime()
        this.HandleBtnRandom_Repeat()
        this.HandleActive_Song()
    }

}

app.start()