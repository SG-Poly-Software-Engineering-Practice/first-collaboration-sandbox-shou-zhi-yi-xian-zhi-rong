document.write('\
<footer id="footer">\
    <script>\
        function addToSubscription() {\
            if(document.getElementById("newsletterForm").checkValidity()) {\
                document.getElementById("newsletterSuccess").style.display = "block";\
            }\
            else {\
                document.getElementById("newsletterSuccess").style.display = "none";\
            }\
        }\
    </script>\
    <div class="container">\
        <div class="row">\
            <div class="footer-ribbon">\
                <span>Get in Touch</span>\
            </div>\
            <div class="col-md-3">\
                <div class="newsletter">\
                    <h4>Newsletter</h4>\
                    <p>Keep up on our always evolving product features and technology. Enter your e-mail and subscribe to our newsletter.</p>\
                    <div class="alert alert-success" id="newsletterSuccess" style="display:none;">\
                        <strong>Success!</strong> You\\ve been added to our email list.\
                    </div>\
                    <form id="newsletterForm" onsubmit="return false;">\
                        <div class="input-group">\
                            <input class="form-control" placeholder="Email Address" id="newsletterEmail" type="email" required>\
                            <span class="input-group-btn">\
                                <button class="btn btn-default" type="submit" onclick="addToSubscription()">Go!</button>\
                            </span>\
                        </div>\
                    </form>\
                </div>\
            </div>\
            <div class="col-md-4">\
                <div class="contact-details">\
                    <h4>Contact Us</h4>\
                    <ul class="contact">\
                        <li><p><i class="icon icon-map-marker"></i> <strong>Address:</strong> 2 Jurong Gateway Road, JEM #09-01, Singapore</p></li>\
                        <li><p><i class="icon icon-phone"></i> <strong>Phone:</strong> (65) 6475-7890</p></li>\
                        <li><p><i class="icon icon-envelope"></i> <strong>Email:</strong> <a href="mailto:support@if.com">support@if.com</a></p></li>\
                    </ul>\
                </div>\
            </div>\
            <div class="col-md-2">\
                <h4>Follow Us</h4>\
                <div class="social-icons">\
                    <ul class="social-icons">\
                        <li class="facebook"><a href="http://www.facebook.com/" target="_blank" data-placement="bottom" rel="tooltip" title="Facebook">Facebook</a></li>\
                        <li class="twitter"><a href="http://www.twitter.com/" target="_blank" data-placement="bottom" rel="tooltip" title="Twitter">Twitter</a></li>\
                        <li class="linkedin"><a href="http://www.linkedin.com/" target="_blank" data-placement="bottom" rel="tooltip" title="Linkedin">Linkedin</a></li>\
                    </ul>\
                </div>\
            </div>\
        </div>\
    </div>\
    <div class="footer-copyright">\
        <div class="container">\
            <div class="row">\
                <div class="col-md-1">\
                    <a href="/B/SG/index.html" class="logo">\
                        <img alt="Island Furniture" class="img-responsive" src="../img/logo-footer.png">\
                    </a>\
                </div>\
                <div class="col-md-7">\
                    <p>Copyright 2014. All Rights Reserved.</p>\
                </div>\
                <div class="col-md-4">\
                    <nav id="sub-menu">\
                        <ul><li><a href="/B/selectCountry.html">Change Location</a></li></ul>\
                    </nav>\
                </div>\
            </div>\
        </div>\
    </div>\
    <div role="dialog" class="modal fade" id="myModal">\
        <div class="modal-dialog">\
            <div class="modal-content">\
                <div class="modal-header">\
                    <h4>Thank you for subscribing</h4>\
                </div>\
                <div class="modal-body">\
                    <p id="messageBox">You have been added to our subscription list!</p>\
                </div>\
                <div class="modal-footer">\
                    <input class="btn btn-primary" name="btnRemove" type="submit" value="Ok" />\
                </div>\
            </div>\
        </div>\
    </div>\
</footer>');