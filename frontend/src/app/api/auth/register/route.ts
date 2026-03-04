import { NextResponse } from "next/server";

async function getAdminToken() {
    const tokenUrl = "http://kuafor_keycloak:8080/realms/master/protocol/openid-connect/token";

    const body = new URLSearchParams({
        client_id: "admin-cli",
        grant_type: "password",
        username: process.env.KEYCLOAK_ADMIN || "admin",
        password: process.env.KEYCLOAK_ADMIN_PASSWORD || "admin",
    });

    const res = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
    });

    if (!res.ok) {
        throw new Error("Failed to authenticate with Keycloak Admin API");
    }

    const data = await res.json();
    return data.access_token;
}

function generateRandomPassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type } = body;

        const token = await getAdminToken();

        let userData: any = {
            enabled: true,
            emailVerified: true,
            attributes: {
                registration_type: type,
            }
        };

        let generatedPassword = "";

        if (type === "B2C") {
            const { firstName, lastName, phone, email, password } = body;
            if (!email || !password || !firstName) {
                return NextResponse.json({ error: "Eksik bilgi girdiniz." }, { status: 400 });
            }

            userData.username = email;
            userData.email = email;
            userData.firstName = firstName;
            userData.lastName = lastName;
            userData.credentials = [{ type: "password", value: password, temporary: false }];
            userData.attributes.phone = phone;

        } else if (type === "B2B") {
            const { branchName, address, email, phone, contactName } = body;
            if (!email || !branchName || !phone) {
                return NextResponse.json({ error: "Eksik bilgi girdiniz." }, { status: 400 });
            }

            generatedPassword = generateRandomPassword();
            const names = contactName ? contactName.split(" ") : ["Yetkili", "Kişi"];

            userData.username = email;
            userData.email = email;
            userData.firstName = names[0];
            userData.lastName = names.slice(1).join(" ") || "Kişi";
            userData.credentials = [{ type: "password", value: generatedPassword, temporary: false }];
            userData.attributes.phone = phone;
            userData.attributes.branchName = branchName;
            userData.attributes.address = address;
            userData.attributes.contactName = contactName;

        } else {
            return NextResponse.json({ error: "Geçersiz kayıt tipi." }, { status: 400 });
        }

        // 1. Create User
        const createUserUrl = "http://kuafor_keycloak:8080/admin/realms/kuafor_realm/users";
        const createRes = await fetch(createUserUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!createRes.ok) {
            if (createRes.status === 409) {
                return NextResponse.json({ error: "Bu e-posta adresi zaten kullanımda." }, { status: 409 });
            }
            const errText = await createRes.text();
            console.error("Keycloak Create User Error:", errText);
            return NextResponse.json({ error: "Kullanıcı oluşturulamadı." }, { status: 500 });
        }

        // Attempt to optionally fetch the created user to assign roles
        // We search by email
        const usersRes = await fetch(`http://kuafor_keycloak:8080/admin/realms/kuafor_realm/users?email=${encodeURIComponent(userData.email)}&exact=true`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (usersRes.ok) {
            const users = await usersRes.json();
            if (users && users.length > 0) {
                const userId = users[0].id;

                // Find role by name
                const roleName = type === "B2C" ? "customer" : "branch_admin";
                const roleRes = await fetch(`http://kuafor_keycloak:8080/admin/realms/kuafor_realm/roles/${roleName}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (roleRes.ok) {
                    const role = await roleRes.json();

                    // Assign role
                    await fetch(`http://kuafor_keycloak:8080/admin/realms/kuafor_realm/users/${userId}/role-mappings/realm`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify([{
                            id: role.id,
                            name: role.name
                        }])
                    });
                }
            }
        }

        // Send email for B2B using nodemailer
        if (type === "B2B") {
            try {
                const nodemailer = await import("nodemailer");
                const transporter = nodemailer.createTransport({
                    host: "mail.biasdanismanlik.com",
                    port: 465,
                    secure: true, // true for 465, false for other ports
                    auth: {
                        user: "advert@biasdanismanlik.com",
                        pass: "Oguzhan1907!",
                    },
                });

                const mailOptions = {
                    from: '"Sistem Randevu" <advert@biasdanismanlik.com>',
                    to: userData.email,
                    subject: "SistemRandevu - Kurumsal Hesabınız Oluşturuldu",
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #059669;">SistemRandevu'ya Hoş Geldiniz!</h2>
                            <p>Merhaba <b>${userData.attributes.contactName}</b>,</p>
                            <p>SistemRandevu kurumsal şube hesabınız (${userData.attributes.branchName}) başarıyla oluşturulmuştur.</p>
                            <br/>
                            <p>Sisteme giriş yapabilmeniz için güvenli şifreniz aşağıdadır. Lütfen bu şifreyi kimseyle paylaşmayınız:</p>
                            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 18px; text-align: center; letter-spacing: 2px;">
                                <strong>${generatedPassword}</strong>
                            </div>
                            <p>Hemen sisteme giriş yapmak için aşağıdaki bağlantıya tıklayabilirsiniz:</p>
                            <a href="https://sistemrandevu.biasdanismanlik.com/login" style="display: inline-block; padding: 10px 20px; background-color: #059669; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Giriş Yap</a>
                            <br/><br/>
                            <p>İyi çalışmalar dileriz,<br/>SistemRandevu Ekibi</p>
                        </div>
                    `,
                };

                await transporter.sendMail(mailOptions);
                console.log(`B2B Registration Email sent successfully to ${userData.email}`);
            } catch (mailError) {
                console.error("Failed to send B2B registration email:", mailError);
                // We don't fail the whole registration if email fails, but we should log it
            }
        }

        return NextResponse.json({ success: true, message: "Kayıt başarılı." });

    } catch (error: any) {
        console.error("Register Error:", error);
        return NextResponse.json({ error: "Sunucu hatası oluştu." }, { status: 500 });
    }
}
