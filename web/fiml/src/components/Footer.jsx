import React from 'react'

export default function Footer() {
    return (
        <footer className="aovis-footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-main">
                        <div className="footer-brand">
                            <h2 className="logo">CineMax</h2>
                            <p>Trợ giúp / Chính sách bảo mật</p>
                        </div>
                        <p className="footer-description">
                            Đặt vé xem phim dễ dàng với hệ thống CineMax trên toàn quốc
                        </p>
                    </div>

                    <div className="footer-links">
                        <div className="link-group">
                            <button className="get-ticket-btn">Đặt Vé Ngay</button>
                        </div>

                        <div className="link-group">
                            <h4>Thể loại phim</h4>
                            <ul>
                                <li><a href="#">Hành động</a></li>
                                <li><a href="#">Phiêu lưu</a></li>
                                <li><a href="#">Hoạt hình</a></li>
                                <li><a href="#">Hài hước</a></li>
                                <li><a href="#">Hình sự</a></li>
                            </ul>
                        </div>

                        <div className="link-group">
                            <h4>Liên kết</h4>
                            <ul>
                                <li><a href="#">Giới thiệu</a></li>
                                <li><a href="#">Tài khoản</a></li>
                                <li><a href="#">Tin tức</a></li>
                                <li><a href="#">Sự kiện</a></li>
                                <li><a href="#">Liên hệ</a></li>
                            </ul>
                        </div>

                        <div className="link-group">
                            <h4>Nhận tin</h4>
                            <p className="newsletter-desc">Đăng ký nhận bản tin từ Baovis ngay hôm nay.</p>
                            <div className="newsletter-form">
                                <input
                                    type="email"
                                    placeholder="Địa chỉ email"
                                    className="email-input"
                                />
                                <div className="agree-terms">
                                    <label className="checkbox-label">
                                        <input type="checkbox" />
                                        <span>Tôi đồng ý với tất cả điều khoản và chính sách của công ty</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© Bản quyền 2024 bởi CineMax.com</p>
                </div>
            </div>
        </footer>
    )
}
