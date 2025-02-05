<?php

if (empty($CHECK_INCLUDED)) {
    define('AUTH_AUTHREQUIRED', true);
    define('SETTINGS_INSTALLREQUIRED', false);
    include '../../engine/inc.page.php';
}

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>berta / welcome</title>
        <style type="text/css">
            html, body {
                width: 100%;
                height: 100%;
            }
            body {
                margin: 0;
                padding: 0;
                color: #333333;
                font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
                font-size: 12px;
                font-weight: normal;
                font-style: normal;
                font-variant: normal;
                line-height: normal;
                background-color: #FFFFFF;
                text-align: left;
            }
            .xMAlign-container {
                display: table;
                width: 100%;
                height: 100%;
            }
                .xMAlign-outer {
                    display: table-cell;
                    vertical-align: middle;
                    text-align: center;
                    top: 50%;
                }
                    .xMAlign-inner {
                        display: block;
                        position: relative;
                        top: -50%;
                        text-align: center;
                        width: 400px;
                        margin-left: auto;
                        margin-right: auto;
                        padding: 30px;
                    }
                        h2 {
                            margin: 0 0 20px;
                            font-size: 400%;
                            line-height: 100%;
                        }
        </style>
    </head>
    <body class="xLoginPageBody">
        <div class="xMAlign-container xPanel">
            <div class="xMAlign-outer">
                <div class="xMAlign-inner">
                    <h2>Thank you for choosing Berta.me!</h2>
                    <p>This server does not meet Berta's requirements.<br />
                    Berta needs PHP >= 8.2 support on server.</p>
                </div>
            </div>
        </div>
    </body>
</html>
