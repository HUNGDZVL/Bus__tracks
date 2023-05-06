const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function start() {
  handleClickIcon();

  // sử dụng promises để gọi data trước rồi mới xử lí các event
  getDataAPI()
    .then((data) => {
      //nếu như promise thành công thì thực thi các hàm phía dưới
      renderDataUi(data);
      activeColor();
      showInfodata();
    }) // báo lỗi khi promise thất bại
    .catch((error) => {
      console.log(error);
    });
}
start();
// hàm xử lí đong mở data left
function handleClickIcon() {
  const blockLeft = $(".app__left");
  const blockRight = $(".app__right--content");
  const iconLeft = $(".icon--left");
  const iconRight = $(".icon--right");
  const itemIcon = $(".app__right--icon");
  itemIcon.onclick = () => {
    // đổi dấu mũi tên

    iconLeft.classList.toggle("disable");
    iconRight.classList.toggle("disable");
    // kiểm tra xem nếu icon mũi tên phía trái có class disable thì thực hiện di chuyên ra ngoài
    if (iconLeft.classList.contains("disable")) {
      blockLeft.style.transform = "translateX(-100%)";
      blockRight.style.transform = "translateX(-17%)";
      blockRight.classList.add("active__rightl");
    } else {
      // di chuyển về vị trí cũ
      blockLeft.style.transform = "translateX(0%)";
      blockRight.style.transform = "translateX(0%)";
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

function renderDataUi(tracksdata) {
  console.log(tracksdata);
  const ListItemdata = $(".app__left--content");
  const Itemdata = document.createElement("div");
  Itemdata.setAttribute("class", "item__data");
  const htmls = tracksdata.map((value, index) => {
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
  const closeAll = $(".app__left");

  closeIcon.onclick = (e) => {
    const blockin4 = e.target.parentNode;
    blockin4.classList.add("disable");
  };
}
