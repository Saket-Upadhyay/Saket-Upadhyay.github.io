---
layout: post
title: "Create a CSR in Windows 11/10"
author: Saket
date:   2021-10-08 12:12:12 +0530
image: https://miro.medium.com/max/1400/1*QrQU6iwTJ_mC892cS3KKjw.png
image_caption:
---

<div class="message">
How to create your own Certificate Signing Request for SSL implementation.
</div>

What is a CSR? - A certificate signing request (CSR) is the initial step to implement SSL/TLS on your server. The CSR is generated in the target server itself and contains important information about your server like — domain, country, owner details and general contact details along with the public key of the organization/individual which is signed by their respective private key.
<!--more-->
The Certificate Authority (CA) will use the data from the CSR to build your SSL Certificate.

## Key information in a CSR

A general purpose CSR will contain the following information -

**Common Name (CN):** your domain or a domain wildcard.

**Organization (O):** Name of your organization.

**Organization Unit (OU):** Sub-unit/division of above organization which will handle this certificate.

**Locality (L): **The city where your organization is located. (This shouldn’t be abbreviated.)

**State/County/Region (S):** The State where your organization is located.

**Country (C):** The ISO_3166-1 two-letter code for the country where your organization is located. (eg. IN/US/GB/AU/RU/CN)

**Email (Email):** Your/organization's department's email address.

## How to create signing request in Windows?

**Using certreq.exe**

`certreq.exe` is a tool in Microsoft Windows which can create a CSR.

To create one, you will need to follow 3 simple steps.

### Step 1: Setup base information in *.ini file

In this step, you need to fill your information in a specific format (like one given below) which will be used by certreq.exe to create your CSR.

You can use the file below as a template. Be sure to change the contents of `Subject` according to your use case. Key values in “Subject” field are your `CN`, `OU`, `O`, et cetera. as discussed in previous section.

You can leave the rest as it is. This template will generate `RSA (KeySpec = 1) 2048 (KeyLength = 2048)` bits keys.

<script src="https://gist.github.com/Saket-Upadhyay/e0a94ee2cda1da095e0dbb401caca071.js"></script>


### Step 2: Generate the CSR.

After you save the above file, you can run the following command in an admin shell to generate your CSR. (I’ve saved the file as `CSRinformation.ini`)

> certreq.exe -new .\CSRinformation.ini CSRrequest.txt

The generated CSR will be stored in `CSRrequest.txt`

![](https://miro.medium.com/max/1400/1*298M4if1UpZtvr_Qu6rcaA.png)

### Step 3: Validating the generated CSR.

The generated CSR’s structure should look similar to the one given below, the contents should/will be different.

<script src="https://gist.github.com/Saket-Upadhyay/b1cf6ac1814ef0311ff1f3a633296c0a.js"></script>

Now you can submit this in a CSR checker to validate your request before submitting this in your CPanel.

![](https://miro.medium.com/max/1400/1*hEiNq-Jf6s3FO39Np3HeCA.jpeg)

## More resources:

1. You can also generate a CSR with IIS Manager in Windows, this method is well covered in ssl.com’s article; here is a link for the same — [**https://www.ssl.com/how-to/generate-a-certificate-signing-request-csr-in-iis-10/**](https://www.ssl.com/how-to/generate-a-certificate-signing-request-csr-in-iis-10/)

2. You can read more about certreq.exe and the parameters of the *.ini file in the official documentation — [**https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/certreq_1**](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/certreq_1)

3. You can check your CSR’s validity at —
[**https://www.digicert.com/ssltools/view-csr/**](https://www.digicert.com/ssltools/view-csr/)

![](https://miro.medium.com/max/800/0*WffPj6x8bAKx_peu)