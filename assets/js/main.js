const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

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
      changIcon();
    }) // báo lỗi khi promise thất bại
    .catch((error) => {
      console.log(error);
    });
}
start();
// hàm xử lí đong mở data__left
function handleClickIcon() {
  const blockLeft = $(".app__left");
  const blockRight = $(".app__right--content");
  const iconLeft = $(".icon--left");
  const iconRight = $(".icon--right");
  const itemIcon = $(".app__right--icon");
  const fixMobilecontent = $(".app__right--header");
  itemIcon.onclick = () => {
    // đổi dấu mũi tên

    iconLeft.classList.toggle("disable");
    iconRight.classList.toggle("disable");
    // kiểm tra xem nếu icon mũi tên phía trái có class disable thì thực hiện di chuyên ra ngoài
    if (iconLeft.classList.contains("disable")) {
      blockLeft.style.transform = "translateX(-100%)";
      blockRight.style.transform = "translateX(-13%)";
      // check kich thước man hình mobile
      if (window.matchMedia("(max-width: 740px)").matches) {
        // Thực thi code JavaScript tại đây
        fixMobilecontent.style.transform = "translateX(-50%)";
      }
      blockRight.classList.add("active__rightl");
    } else {
      // di chuyển về vị trí cũ
      blockLeft.style.transform = "translateX(0%)";
      blockRight.style.transform = "translateX(0%)";
      // check kich thước man hình mobile

      if (window.matchMedia("(max-width: 740px)").matches) {
        // Thực thi code JavaScript tại đây
        fixMobilecontent.style.transform = "translateX(0%)";
      }

      setTimeout(() => {
        blockRight.classList.remove("active__rightl");
      }, 1500);
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
        reject(error); //giải quyết dữ liệu với lỗi không k data
      });
  });
}

function renderDataUi(dataItem) {
  const ListItemdata = $(".app__left--content");
  const Itemdata = document.createElement("div");
  Itemdata.setAttribute("class", "item__data");
  const htmls = dataItem.map((value, index) => {
    return `
        <div class="block__data">
            <div class="data__show class-${index}">
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
  const polylineLayer = L.polyline(points, { color: "red" }).addTo(map);
  polylineLayer.bringToBack();

  // tao thanh control

  let objectData = [];
  dataLatlng.map((poin) => {
    const [lat, lng] = poin.location.split(","); // lấy tọa độ
    const timeString = poin.time; // lấy date
    const dates = new Date(timeString); // chuyển dổi dữ liệu date

    // Chuyển đổi đối tượng Date sang Unix timestamp (tính bằng mili giây)
    const unixTimestamp = dates.getTime() / 1000;
    const direction = poin.direction;

    let newDatamap = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
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
    targetOptions: {
      // chọn hình ảnh điều chỉnh img
      useImg: true,
      imgUrl: "../assets/img/ships.png",
      height: 35,
      with: 35,
      iconAnchor: [25, 25],
      pane: "markerPane",
    }, // tùy chọn đường đi
    trackLineOptions: {
      isDraw: true,
      stroke: true,
      color: "#FFFF33",
      weight: 6,
      fill: false,
      fillColor: "#000",
      opacity: 0.9,
      pane: "overlayPane",
    }, // tùy chọn thanh điều khiển
    playControl: true,
    // thêm option dir từ api
    markerOptions: {
      rotationAngle: "dir",
    }, // thêm đoạn này để sử dụng thông tin direction trong objectData
  };
  const trackplayback = L.trackplayback(objectData, map, options);
  console.log(trackplayback);

  // Optional  (only if you need plaback control)
  const trackplaybackControl = L.trackplaybackcontrol(trackplayback);

  trackplaybackControl.addTo(map);
  trackplaybackControl.bringToFront();//để đưa thanh điều khiển phát lại lên trên cùng bản đồ, 
  //tránh bị che khuất bởi các lớp khác. 
 
}

function changIcon() {
  const ListIcons = $$(".buttonContainer a");
  for (let j = 0; j < ListIcons.length; j++) {
    if (j != 0) {
      ListIcons[j].style.display = "none";
    }
  }

  const Listtime = $$(".info-container");
  for (let i = 0; i < Listtime.length; i++) {
    if (i == 0 || i == 1) {
      Listtime[i].style.display = "none";
    }
  }
  const texttime = $$(".info-title");
  for (let item of texttime) {
    item.style.display = "none";
  }
}
