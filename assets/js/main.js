const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
let = currentItem = 1;
function start() {
  handleClickIcon();

  // sử dụng promises để gọi data trước rồi mới xử lí các event
  getDataAPI()
    .then((traskdata) => {
      //nếu như promise thành công thì thực thi các hàm phía dưới
      renderDataUi(traskdata);
      activeColor();
      showInfodata();
      paginateItems();
      showMap(traskdata);
    }) // báo lỗi khi promise thất bại
    .catch((error) => {
      console.log(error);
    });
}
start();
// hàm xử lí đong mở data__left
function handleClickIcon() {
  const blockLeft = $(".app__left");
  const blockRight = $(".app__right");
  const iconLeft = $(".icon--left");
  const iconRight = $(".icon--right");
  const itemIcon = $(".app__right--icon");
  const fixMobilecontent = $(".app__right--header");
  itemIcon.onclick = () => {
    // đổi dấu mũi tên

    iconLeft.classList.toggle("disable");
    iconRight.classList.toggle("disable");

    //kiểm tra xem nếu icon mũi tên phía trái có class disable thì thực hiện di chuyên ra ngoài
    if (iconLeft.classList.contains("disable")) {
      blockLeft.classList.replace("l-2", "l-0");
      blockLeft.classList.replace("ls-3", "ls-0");
      blockLeft.classList.replace("m-4", "m-0");
      blockLeft.classList.replace("c-7", "c-0");
      blockRight.classList.replace("l-10", "l-12");
      blockRight.classList.replace("ls-9", "ls-12");
      blockRight.classList.replace("m-8", "m-12");
      blockRight.classList.replace("c-5", "c-12");
    }else{
      blockLeft.classList.replace("l-0", "l-2");
      blockLeft.classList.replace("ls-0", "ls-3");
      blockLeft.classList.replace("m-0", "m-4");
      blockLeft.classList.replace("c-0", "c-7");
      blockRight.classList.replace("l-12", "l-10");
      blockRight.classList.replace("ls-12", "ls-9");
      blockRight.classList.replace("m-12", "m-8");
      blockRight.classList.replace("c-12", "c-5");
    }
  };
}
// hàm lấy dữ liệu api
function getDataAPI() {
  return new Promise((resolve, reject) => {
    // sử dụng promise để render data
    const API = "https://api.midvietnam.com/studyapi/getdatagps";
    fetch(API)
      .then((response) => response.json())
      .then((data) => {
        const traskdata = data.tracks;
        resolve(traskdata); // giải quyết promise với dữ liệu trả về resolve nếu có data
      })
      .catch((error) => {
        console.error("Error:", error);
        reject(error); //giải quyết dữ liệu với lỗi không data
      });
  });
}

function renderDataUi(dataItem) {
  const ListItemdata = $(".app__left--content");
  const Itemdata = document.createElement("div");
  Itemdata.setAttribute("class", "item__data");
  // them id là định dàng time unix để xử lí với time unix trong map khi thanh control tới mốc time
  const htmls = dataItem.map((value, index) => {
    //
    const timeStr = value.time; // lấy date
    const changedate = new Date(timeStr); // chuyển dổi dữ liệu date

    // Chuyển đổi đối tượng Date sang Unix timestamp (tính bằng mili giây)
    const unixTimes = changedate.getTime() / 1000;

    //
    return `
        <div class="block__data">
            <div class="data__show class-${index}" id="${unixTimes}">
                <div class="data__time">${value.time.split(" ")[1]}</div>
                <span class="bulkhead">|</span>
                <div class="data__location">${value.location.replace(
                  /,/g,
                  " - "
                )}</div>
            </div>
            <div class="data__info check-${index} disable">
                <i class="closein4 fa-solid fa-xmark"></i>
                <div class="data__licence_plate">Biển số: ${
                  value.licence_plate
                }</div>
                <div class="data__driver_id">ID: ${value.driver_id}</div>
                <div class="data__speed">Tốc độ: ${value.speed}</div>
                <div class="data__direction">Hướng đi: ${value.direction}</div>
                <div class="data__packing">Thời gian dừng: ${
                  value.packing
                }</div>
                <div clas="data__s1">Dữ liệu: ${value.s1}</div>

            </div>
        </div>
     `;
  });
  Itemdata.innerHTML = htmls.join(" ");
  ListItemdata.appendChild(Itemdata);
}
// hàm chỉnh màu xen kẽ
function activeColor() {
  const allActive = $$(".data__show");
  // ngăn hành vi nổi bọt lên item

  for (let i = 0; i < allActive.length; i++) {
    // Kiểm tra xem class của phần tử có phải là số chẵn hay không
    if (i % 2 === 0) {
      // Thêm class active vào phần tử có class là số chẵn
      allActive[i].classList.add("active--color");
    }
  }
}
// ham xử lí options ẩn trong api (infomation)
function showInfodata() {
  const infoData = $$(".data__show");
  for (let i = 0; i < infoData.length; i++) {
    infoData[i].onclick = (e) => {
      const checkdataIn4 = $$(".data__info");
      // duyệt qua tât cả thẻ chứa in4
      for (let item of checkdataIn4) {
        // lấy thẻ cha chứa option để chọn option con tương ứng
        const optionInfo = e.target.parentNode.parentNode;
        const opTionInfo = optionInfo.querySelector(".data__info");
        const closeIcon = optionInfo.querySelector(".closein4");
        // nếu như thẻ chứa in4 khác với thẻ in4 được click thì add disable vô
        if (item !== opTionInfo) {
          item.classList.add("disable");
        }
        // hiện in4 khi click vào nó
        opTionInfo.classList.remove("disable");
        closeItemInfo(closeIcon);
      }
    };
  }
}

function closeItemInfo(closeIcon) {
  closeIcon.onclick = (e) => {
    const blockin4 = e.target.parentNode;
    blockin4.classList.add("disable");
  };
}
//ham phân trang
function paginateItems() {
  // danh sach phần tử phân trang
  const Listitems = $$(".block__data");

  //tính toán só lượng trag
  let pageSize = 500;
  let pageCount = Math.ceil(Listitems.length / pageSize);
  // biến lưu trữ trang
  let currentPage = 1;
  // lay 2 nút next and pre page
  const prePage = $(".ileft");
  const nextPage = $(".iright");
  const pageNumber = $(".inumber");

  // add event prePage
  prePage.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      //gọi hàm thay dỗi dữ liệu trang khi số trang thay đối
      displayPage(currentPage, pageSize, Listitems);
      pageNumber.innerHTML = currentPage;
    }
  });
  //add event nextPage
  nextPage.addEventListener("click", () => {
    if (currentPage < pageCount) {
      currentPage++; //gọi hàm thay dỗi dữ liệu trang khi số trang thay đối
      displayPage(currentPage, pageSize, Listitems);
      // cập nhật số trang
      pageNumber.innerHTML = currentPage;
    }
  });
  // hiện thị trang đâu tiên vô sô trang
  displayPage(currentPage, pageSize, Listitems);
  pageNumber.innerHTML = currentPage;
}

function displayPage(crrpage, pageSz, Litems) {
  for (let i = 0; i < Litems.length; i++) {
    // duyệt qua tất cả item trong trang
    // số item nằm bắt từ đầu trang cho đến cuối trang sẽ dc hiện, còn lại ẩn đi
    if (i >= (crrpage - 1) * pageSz && i < crrpage * pageSz) {
      Litems[i].style.display = "block";
    } else {
      Litems[i].style.display = "none";
    }
  }
}
function showMap(dataLatlng) {
  // poinstart
  const start = dataLatlng[0].location;
  const [latstart, lngstart] = start.split(",");

  //poinview
  const centerpoint = dataLatlng[Math.floor(dataLatlng.length / 2)].location;
  const [latview, lngview] = centerpoint.split(",");

  //poinend
  const end = dataLatlng[dataLatlng.length - 1].location;
  const [latsend, lngsend] = end.split(",");
  // định vị bảng đồ dựa vào pointview
  let map = L.map("map").setView([latview, lngview], 8);
  map.options.pixelRatio = window.devicePixelRatio || 1;
  // đưa bảng đồ vào browser
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
  }).addTo(map);
  // tạo icon màu đỏ để dánh dấu bảng đò
  let redMarker = L.icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [15, 20],
    iconAnchor: [12, 21],
    popupAnchor: [1, -21],
  });

  // danh dấu vị trí start
  L.marker([latstart, lngstart], { icon: redMarker })
    .addTo(map)
    .bindTooltip("Điểm xuất phát")
    .openTooltip();
  // đánh dấu vị trí end
  L.marker([latsend, lngsend], { icon: redMarker })
    .addTo(map)
    .bindTooltip("Điểm kết thúc")
    .openTooltip();

  // tạo arr chứa toan bộ tọa độ diểm trong api (destructuring)
  const points = dataLatlng.map((poin) => {
    const [lat, lng] = poin.location.split(",");
    return [lat, lng];
  });
  // vẽ đường đi dựa trên tọa độ lat and lng trong api
  L.polyline(points, {
    color: "red",
    opacity: 0.3,
    zIndex: 1,
  }).addTo(map);

  // tao thanh control

  let objectData = [];
  dataLatlng.map((poin) => {
    const [latS, lngS] = poin.location.split(","); // lấy tọa độ
    const timeString = poin.time; // lấy date
    const dates = new Date(timeString); // chuyển dổi dữ liệu date

    // Chuyển đổi đối tượng Date sang Unix timestamp (tính bằng mili giây)
    const unixTimestamp = dates.getTime() / 1000;
    //

    //
    const direction = poin.direction;

    let newDatamap = {
      lat: parseFloat(latS),
      lng: parseFloat(lngS),
      // chuyển đổi giá trị của biến lat và lng từ chuỗi sang số thực (floating-point number),
      // bởi vì đối tượng L.LatLng yêu cầu giá trị của lat và lng phải là kiểu số thực.
      time: unixTimestamp,
      dir: direction,
    };

    objectData.push(newDatamap); // đưa dữ liệu vào obj
  });

  // tùy chỉnh option
  let options = {
    tickLen: 1000, // thời gian hoạt động 1s
    clockOptions: {
      speed: 5,
      // the max speed
      maxSpeed: 65,
    },
    targetOptions: {
      // chọn hình ảnh điều chỉnh img
      useImg: true,
      imgUrl: "../assets/img/ships.png",
      height: 35,
      with: 35,
      iconAnchor: [25, 25],
      position: "relative",
      zIndex: 1,
    }, // tùy chọn đường đi
    trackLineOptions: {
      isDraw: true,
      stroke: true,
      color: "#FFFF33",
      weight: 6,
      fill: false,
      fillColor: "#000",
      opacity: 0.9,
      zIndex: 1000,
    }, // tùy chọn thanh điều khiển
    playControl: true,
    // thêm option dir từ api
    // markerOptions: {
    //   //rotationAngle: "dir",
    // }, // thêm đoạn này để sử dụng thông tin direction trong objectData
  };
  const trackplayback = L.trackplayback(objectData, map, options);

  // Optional  (only if you need plaback control)
  const trackplaybackControl = L.trackplaybackcontrol(trackplayback);

  trackplaybackControl.addTo(map);
  const iconsclose = $(".btn-close");
  iconsclose.style.display = "none";
  // Lắng nghe sự kiện playback:tick để lấy tọa độ
  trackplayback.on(
    "tick",
    (e) => {
      const checktimeplay = Math.floor(e.time);
      // const date = new Date(e.time * 1000);
      // const hours = date.getHours();
      // const minutes = date.getMinutes();
      // const seconds = date.getSeconds();
      // //chuyển đổi thời gian đang chạy của Leaflet.TrackPlayBack từ dạng Unix timestamp
      // //sang dạng chuỗi có định dạng giờ:phút:giây và định dạng lại chuỗi theo cấu trúc hh:mm:ss.
      // const timeplay = `${hours}:${minutes}:${seconds}`;
      // const [h1, m1, s1] = timeplay.split(":").map(Number);
      // const str1Formatted = `${h1 < 10 ? "0" : ""}${h1}:${
      //   m1 < 10 ? "0" : ""
      // }${m1}:${s1 < 10 ? "0" : ""}${s1}`;

      // checkAPI(str1Formatted);
      checkAPI(checktimeplay);
    },
    this
  );
}

function checkAPI(timepl) {
  const itemList = $$(".data__show");
  for (let i = 0; i < itemList.length; i++) {
    //check xem id cua có bằng vs time play floor hay chưa
    if (itemList[i].id == timepl) {
      //them acctive vô nếu bằng
      itemList[i].classList.add("checkin--color");
      currentItem++;
      // Tìm phần tử tiếp theo cần cuộn đến
      const nextItem = itemList[i - 2];
      // bat dau croll từ item thứ 5
      if (nextItem && i > 5) {
        requestAnimationFrame(() => {
          nextItem.scrollIntoView({ behavior: "smooth" });
        });
      }
      break;
    } else {
      // xóa đi sau 1s nếu khác
      setTimeout(() => {
        itemList[i].classList.remove("checkin--color");
      }, 50);
    }
  }
  // kiểm tra nếu đã hiển thị đủ 500 items thì chuyển trang
  console.log(currentItem);
  if (currentItem >= 450) {
    currentItem = 0;
    const nextPages = $(".iright ");
    nextPages.click(); // tự động chuyển sang trang mới
  }
}
