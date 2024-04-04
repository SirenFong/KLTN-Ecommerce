import React, { useState } from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";

const FAQPage = () => {
  return (
    <div>
      <Header activeHeading={5} />
      <Faq />
      <Footer />
    </div>
  );
};

const Faq = () => {
  const [activeTab, setActiveTab] = useState(0);

  const toggleTab = (tab) => {
    if (activeTab === tab) {
      setActiveTab(0);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className={`${styles.section} my-8`}>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">FAQ</h2>
      <div className="mx-auto space-y-4">
        {/* single Faq */}

        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex items-center justify-between w-full"
            onClick={() => toggleTab(2)}
          >
            <span className="text-lg font-medium text-gray-900">
              Chính sách đổi trả thuốc ?
            </span>
            {activeTab === 2 ? (
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
          {activeTab === 2 && (
            <div className="mt-4">
              <p className="text-base text-gray-500">
                - Thời gian đổi trả không quá 30 ngày kể từ ngày mua - Sản phẩm
                có lỗi nhà sản xuất (biến đổi màu, màu không đồng nhất, sản phẩm
                dạng viên có bột vụn, sản phẩm dạng kem bị vữa hay vón cục, sản
                phẩm lỏng dạng hỗn dịch bị phân lớp,...)
              </p>
              <p className="text-base text-gray-500">
                - Khách hàng mang sản phẩm đã mua (bao gồm vỏ hộp, giấy hướng
                dẫn sử dụng kèm theo) tới cửa hàng Nhà thuốc Thanh Thương gần
                nhất để được thực hiện đổi trả và hoàn tiền. Để nhận tiền hoàn,
                khách hàng có 2 lựa chọn: Hoàn tiền tại quầy: Cửa hàng chi tiền
                mặt tại quầy cho khách hàng. Hoàn tiền qua chuyển khoản: Sau khi
                tiếp nhận yêu cầu hoàn tiền qua chuyển khoản của khách, Nhà
                thuốc Thanh Thương sẽ gửi tới khách hàng một đường link điền
                thông tin nhận số tiền hoàn vào số điện thoại mua hàng trên đơn
                hàng. Sau khi khách hàng gửi thông tin thành công, Nhà thuốc
                Thanh Thương sẽ hoàn lại tiền trong vòng từ 2-3 ngày (không kể
                thứ 7, CN, hoặc ngày lễ, Tết).
              </p>
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex items-center justify-between w-full"
            onClick={() => toggleTab(3)}
          >
            <span className="text-lg font-medium text-gray-900">
              Chính sách giao hàng ?
            </span>
            {activeTab === 3 ? (
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
          {activeTab === 3 && (
            <div className="mt-4">
              <p className="text-base text-gray-500">
                - Thuốc kê đơn: Nhà thuốc Thanh Thương chỉ bán thuốc kê đơn tại
                nhà thuốc khi có đơn thuốc hợp lệ, theo đúng chỉ định của người
                kê đơn, Thuốc kê đơn không bán trực tuyến.
              </p>
              <p className="text-base text-gray-500">
                - Thuốc không kê đơn: Quý khách có thể đặt hàng thuốc không kê
                đơn trực tuyến qua trangweb xxx.xxx, hoặc thông qua ứng dụng
                "Thanh Thương Pharma", Quý khách hàng liên hệ tổng đài
                0707849427 để được hỗ trợ miễn phí.
              </p>
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex items-center justify-between w-full"
            onClick={() => toggleTab(4)}
          >
            <span className="text-lg font-medium text-gray-900">
              Chính sách bảo mật
            </span>
            {activeTab === 4 ? (
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
          {activeTab === 4 && (
            <div className="mt-4">
              <p className="text-base text-gray-500">
                - Nhà thuốc Thanh Thương chỉ thu thập thông tin liên lạc cần
                thiết để thực hiện giao dịch giữa website với khách hàng mà
                không lấy thêm thông tin gì khác. Thông tin của khách hàng sẽ
                chỉ được lưu lại khi khách hàng tạo tài khoản và đăng nhập với
                tài khoản của mình.{" "}
                <p>
                  - Nhà thuốc Thanh Thương thu thập và sử dụng thông tin cá nhân
                  của khách hàng với mục đích phù hợp và hoàn toàn tuân thủ theo
                  pháp luật.
                </p>{" "}
                - Nhà thuốc Thanh Thương cam kết không chia sẻ hay sử dụng thông
                tin cá nhân của khách hàng cho một bên thứ 3 nào khác với mục
                đích lợi nhuận. Thông tin của khách hàng sẽ chỉ được sử dụng
                trong nội bộ Nhà thuốc Thanh Thương.{" "}
                <p>
                  - Khi cần thiết, chúng tôi có thể sử dụng những thông tin này
                  để liên hệ trực tiếp với khách hàng dưới các hình thức như:
                  gửi thư, đơn đặt hàng, thư cảm ơn. Khách hàng có thể nhận được
                  thư định kỳ cung cấp thông tin sản phẩm, dịch vụ mới, thông
                  tin về các chương trình khuyến mãi. Khi khách hàng đăng kí
                  trên website xxx.com, những thông tin chúng tôi thu thập bao
                  gồm:
                  <br />
                  <strong>
                    Tên - Địa chỉ giao hàng - Số điện thoại - Ngày sinh - Giới
                    tính - Những thông tin khác (nếu có).
                  </strong>
                </p>
              </p>
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex items-center justify-between w-full"
            onClick={() => toggleTab(5)}
          >
            <span className="text-lg font-medium text-gray-900">
              Chính sách thanh toán
            </span>
            {activeTab === 5 ? (
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
          {activeTab === 5 && (
            <div className="mt-4">
              <p className="text-base text-gray-500">
                Về thanh toán, có 3 cách. Quý khách có thể thanh toán cho Công
                ty CP Dược phẩm FPT Thanh Thương bằng các hình thức sau:{" "}
                <p>
                  - Thanh toán tại chỗ (Ship COD): Thanh Thương sẽ gọi lại cho
                  khách hàng để xin địa chỉ giao hàng tận nơi và nhận thanh toán
                  tại chỗ.
                </p>{" "}
                <p>
                  {" "}
                  - Thanh toán qua thẻ ngân hàng: Chấp nhận thanh toán nhiều
                  thương hiệu và loại thẻ bao gồm thẻ ATM, thẻ Visa,
                  MasterCard,...
                </p>
                <p>
                  - Chuyển khoản trước: Khách hàng có thể chọn chuyển khoản
                  trước vào tài khoản của Nhà thuốc Thanh Thương Số tài khoản:
                  8983147 Chủ tài khoản: Công ty Cổ Phần Dược Phẩm FPT Thanh
                  Thương Ngân Hàng: Ngân hàng Á Châu.
                </p>
              </p>
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex items-center justify-between w-full"
            onClick={() => toggleTab(6)}
          >
            <span className="text-lg font-medium text-gray-900">
              Chính sách nội dung
            </span>
            {activeTab === 6 ? (
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
          {activeTab === 6 && (
            <div className="mt-4">
              <p className="text-base text-gray-500">
                <p>
                  - Tất cả các sản phẩm bán tại nhà thuốc Thanh Thương đều có mô
                  tả chi tiết. Nhà thuốc sẽ cung cấp thông tin về sản phẩm như
                  ảnh, giấy phép kinh doanh, thành phần, tác dụng và chỉ định sử
                  dụng. Mặc dù chúng tôi lựa chọn và cung cấp thông tin từ các
                  trang web đáng tin cậy và chính thống, có độ chính xác cao,
                  nhưng bạn nên coi đó chỉ là tài liệu tham khảo.
                </p>
                <p>
                  - Nhà thuốc Thanh Thương muốn cung cấp thông tin đầy đủ về
                  thành phần của các loại thuốc. Vì vậy, chúng tôi tổng hợp các
                  thông tin từ Dược thư quốc gia hay hướng dẫn sử dụng được Cục
                  quản lý Dược phê duyệt. Chúng tôi sẽ liên tục cập nhật thông
                  tin mới nhất, vì nó có thể thay đổi theo thời gian. Do đó,
                  trước khi sử dụng, bạn nên đọc kỹ bảng thành phần được cung
                  cấp bởi nhà sản xuất.
                </p>
                <p>
                  - Mục tiêu chúng tôi là cung cấp cho bạn thông tin hiện tại và
                  phù hợp nhất. Tuy nhiên, vì thuốc có thể tương tác, tác dụng
                  phụ khác nhau ở mỗi người, chúng tôi không thể đảm bảo rằng
                  thông tin này bao gồm tất cả các tương tác và tác dụng phụ có
                  thể. Thông tin này không thay thế cho lời khuyên y tế. Luôn
                  luôn nói chuyện với nhà cung cấp dịch vụ y tế và chăm sóc sức
                  khỏe của bạn để được tư vấn kỹ về các tương tác có thể xảy ra
                  với tất cả các loại thuốc hay các sản phẩm không phải là thuốc
                  (thực phẩm chức năng, thực phẩm dinh dưỡng,...) mà bạn đang
                  dùng.
                </p>
                <p>
                  - Nhà thuốc Thanh Thương có thể sửa đổi hoặc bổ sung thông tin
                  mà không báo trước. Công dụng và hiệu quả điều trị của một sản
                  phẩm có thể thay đổi. Thậm chí, sản phẩm có thể có hiệu quả
                  với người này nhưng không hiệu quả với người khác. Chúng tôi
                  không chịu trách nhiệm đối với bất kỳ thông tin chưa chính xác
                  nào hoặc việc sử dụng thuốc mà không có ý kiến của bác sĩ, chỉ
                  dựa trên thông tin do nhà thuốc cung cấp.
                </p>
                <p>
                  - Tất cả nội dung gồm văn bản, hình ảnh, video và các tài
                  nguyên khác trên website nhathuoclongchau.com.vn không được
                  coi là một sự thay thế cho lời khuyên y tế, cũng như chẩn đoán
                  hoặc điều trị từ các bác sĩ. Các thông tin trên website chỉ
                  nên coi như tài liệu tham khảo, không dùng các thông tin này
                  để “chẩn đoán” hoặc “điều trị” cho các vấn đề sức khỏe cũng
                  như các tình trạng y tế khác.
                </p>
              </p>
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex items-center justify-between w-full"
            onClick={() => toggleTab(7)}
          >
            <span className="text-lg font-medium text-gray-900">
              Quy chế hoạt động website cung cấp dịch vụ TMĐT xxx.com
            </span>
            {activeTab === 7 ? (
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
          {activeTab === 7 && (
            <div className="mt-4">
              <p className="text-base text-gray-500">
                <p>
                  - Website thương mại điện tử xxx.com do Công ty Cổ phần dược
                  phẩm FPT Thanh Thương (“Công ty”) thực hiện hoạt động và vận
                  hành. Đối tượng phục vụ là tất cả khách hàng trên 63 tỉnh
                  thành Việt Nam có nhu cầu mua hàng nhưng không có thời gian
                  đến shop hoặc đặt trước để khi đến shop là đảm bảo có hàng.
                </p>
                <p>
                  - Sản phẩm được kinh doanh tại xxx.com phải đáp ứng đầy đủ các
                  quy định của pháp luật, không bán hàng nhái, hàng không rõ
                  nguồn gốc, hàng xách tay. Hoạt động mua bán tại xxx.com phải
                  được thực hiện công khai, minh bạch, đảm bảo quyền lợi của
                  người tiêu dùng.
                </p>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
