import React from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";

import { makeStyles } from "@material-ui/core/styles";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightBold, // Tô đậm
  },
}));

const Faq = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>
            1. Hướng dẫn đổi trả sản phẩm
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Typography>
            Khách hàng mang sản phẩm đã mua (bao gồm vỏ hộp, giấy hướng dẫn sử
            dụng kèm theo) tới cửa hàng Nhà thuốc Thanh Thương gần nhất để được
            thực hiện đổi trả và hoàn tiền. Để nhận tiền hoàn, khách hàng có 2
            lựa chọn: Hoàn tiền tại quầy: Cửa hàng chi tiền mặt tại quầy cho
            khách hàng. Hoàn tiền qua chuyển khoản: Sau khi tiếp nhận yêu cầu
            hoàn tiền qua chuyển khoản của khách, Nhà thuốc Thanh Thương sẽ gửi
            tới khách hàng một đường link điền thông tin nhận số tiền hoàn vào
            số điện thoại mua hàng trên đơn hàng. Sau khi khách hàng gửi thông
            tin thành công, Nhà thuốc Thanh Thương sẽ hoàn lại tiền trong vòng
            từ 2-3 ngày (không kể thứ 7, CN, hoặc ngày lễ, Tết).
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>
            2. Nhà thuốc Thanh Thương có giao hàng thuốc không?
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Typography>
            <span className="font-bold">Thuốc kê đơn</span>: Nhà thuốc Thanh
            Thương chỉ bán thuốc kê đơn tại nhà thuốc khi có đơn thuốc hợp lệ,
            theo đúng chỉ định của người kê đơn, Thuốc kê đơn không bán trực
            tuyến.
            <br />
            <br />
            <span className="font-bold">Thuốc không kê đơn</span>: Quý khách có
            thể đặt hàng thuốc không kê đơn trực tuyến qua trang web xxx, hoặc
            thông qua ứng dụng "Thanh Thương – Chuyên gia thuốc", Quý khách hàng
            liên hệ tổng đài 1800 6928 để được hỗ trợ miễn phí.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>
            3. Chính sách bảo mật
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Typography>
            Nhà thuốc Thanh Thương chỉ thu thập thông tin liên lạc cần thiết để
            thực hiện giao dịch giữa website với khách hàng mà không lấy thêm
            thông tin gì khác. Thông tin của khách hàng sẽ chỉ được lưu lại khi
            khách hàng tạo tài khoản và đăng nhập với tài khoản của mình. Nhà
            thuốc Thanh Thương thu thập và sử dụng thông tin cá nhân của khách
            hàng với mục đích phù hợp và hoàn toàn tuân thủ theo pháp luật. Nhà
            thuốc Thanh Thương cam kết không chia sẻ hay sử dụng thông tin cá
            nhân của khách hàng cho một bên thứ 3 nào khác với mục đích lợi
            nhuận. Thông tin của khách hàng sẽ chỉ được sử dụng trong nội bộ Nhà
            thuốc Long Châu. Khi cần thiết, chúng tôi có thể sử dụng những thông
            tin này để liên hệ trực tiếp với khách hàng dưới các hình thức như:
            gửi thư, đơn đặt hàng, thư cảm ơn. Khách hàng có thể nhận được thư
            định kỳ cung cấp thông tin sản phẩm, dịch vụ mới, thông tin về các
            chương trình khuyến mãi. Khi khách hàng đăng kí trên website
            nhathuoclongchau.com.vn, những thông tin chúng tôi thu thập bao gồm:
            <span className="font-bold">
              Tên - Địa chỉ giao hàng - Số điện thoại - Ngày sinh - Giới tính -
              Những thông tin khác (nếu có).
            </span>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>
            4. Chính sách nội dung
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Typography>
            <span className="font-bold">
              1. Thông báo miễn trừ trách nhiệm:{" "}
            </span>
            Tất cả các sản phẩm bán tại nhà thuốc Long Châu đều có mô tả chi
            tiết. Nhà thuốc sẽ cung cấp thông tin về sản phẩm như ảnh, giấy phép
            kinh doanh, thành phần, tác dụng và chỉ định sử dụng. Mặc dù chúng
            tôi lựa chọn và cung cấp thông tin từ các trang web đáng tin cậy và
            chính thống, có độ chính xác cao, nhưng bạn nên coi đó chỉ là tài
            liệu tham khảo. Nhà thuốc Long Châu muốn cung cấp thông tin đầy đủ
            về thành phần của các loại thuốc. Vì vậy, chúng tôi tổng hợp các
            thông tin từ Dược thư quốc gia hay hướng dẫn sử dụng được Cục quản
            lý Dược phê duyệt. Chúng tôi sẽ liên tục cập nhật thông tin mới
            nhất, vì nó có thể thay đổi theo thời gian. Do đó, trước khi sử
            dụng, bạn nên đọc kỹ bảng thành phần được cung cấp bởi nhà sản xuất.
            Mục tiêu chúng tôi là cung cấp cho bạn thông tin hiện tại và phù hợp
            nhất. Tuy nhiên, vì thuốc có thể tương tác, tác dụng phụ khác nhau ở
            mỗi người, chúng tôi không thể đảm bảo rằng thông tin này bao gồm
            tất cả các tương tác và tác dụng phụ có thể. Thông tin này không
            thay thế cho lời khuyên y tế. Luôn luôn nói chuyện với nhà cung cấp
            dịch vụ y tế và chăm sóc sức khỏe của bạn để được tư vấn kỹ về các
            tương tác có thể xảy ra với tất cả các loại thuốc hay các sản phẩm
            không phải là thuốc (thực phẩm chức năng, thực phẩm dinh dưỡng,...)
            mà bạn đang dùng. Nhà thuốc Long Châu có thể sửa đổi hoặc bổ sung
            thông tin mà không báo trước. Công dụng và hiệu quả điều trị của một
            sản phẩm có thể thay đổi. Thậm chí, sản phẩm có thể có hiệu quả với
            người này nhưng không hiệu quả với người khác. Chúng tôi không chịu
            trách nhiệm đối với bất kỳ thông tin chưa chính xác nào hoặc việc sử
            dụng thuốc mà không có ý kiến của bác sĩ, chỉ dựa trên thông tin do
            nhà thuốc cung cấp. Tất cả nội dung gồm văn bản, hình ảnh, video và
            các tài nguyên khác trên website nhathuoclongchau.com.vn không được
            coi là một sự thay thế cho lời khuyên y tế, cũng như chẩn đoán hoặc
            điều trị từ các bác sĩ. Các thông tin trên website chỉ nên coi như
            tài liệu tham khảo, không dùng các thông tin này để “chẩn đoán” hoặc
            “điều trị” cho các vấn đề sức khỏe cũng như các tình trạng y tế
            khác.
            <br /> <span className="font-bold">2. Góp ý nội dung: </span> Chúng
            tôi luôn cố gắng chọn lọc và cung cấp thông tin từ các nguồn đáng
            tin cậy, nhưng không tránh khỏi khả năng có thông tin chưa thật sự
            chính xác. Nếu bạn phát hiện bất kỳ thông tin không chính xác nào
            hoặc bạn có bất kỳ góp ý nào về thông tin mà chúng tôi cung cấp, rất
            mong bạn liên hệ với chúng tôi để chúng tôi có thể sửa đổi và cập
            nhật thông tin đó.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const FAQPage = () => {
  return (
    <div>
      <Header activeHeading={5} />
      <Faq />
      <Footer />
    </div>
  );
};

export default FAQPage;
