import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Layout } from "@/components";
import { Award, Download, Calendar, BookOpen } from "lucide-react";

interface CertificateData {
  id: string;
  certificateNumber: string;
  issuedAt: string;
  course: {
    id: string;
    title: string;
    description: string;
    instructor: string;
    category: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function CertificateView() {
  const router = useRouter();
  const { certificateId } = router.query;
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady || !certificateId) return;

    const fetchCertificate = async () => {
      try {
        const response = await fetch(`/api/certificates/${certificateId}`);
        if (!response.ok) {
          throw new Error("Сертификат не найден");
        }
        const data = await response.json();
        setCertificate(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки сертификата");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificate();
  }, [router.isReady, certificateId]);

  const handleDownload = () => {
    if (!certificate) return;

    // Создаем HTML для печати/скачивания
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Сертификат - ${certificate.course.title}</title>
          <style>
            @media print {
              @page {
                size: A4 landscape;
                margin: 0;
              }
            }
            body {
              font-family: 'Georgia', serif;
              margin: 0;
              padding: 40px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .certificate {
              background: white;
              padding: 60px;
              border: 20px solid #f4d03f;
              box-shadow: 0 0 30px rgba(0,0,0,0.3);
              max-width: 900px;
              text-align: center;
              position: relative;
            }
            .certificate::before {
              content: '';
              position: absolute;
              top: 20px;
              left: 20px;
              right: 20px;
              bottom: 20px;
              border: 2px solid #667eea;
            }
            .header {
              margin-bottom: 30px;
            }
            .header h1 {
              font-size: 48px;
              color: #667eea;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 3px;
            }
            .subtitle {
              font-size: 18px;
              color: #666;
              margin-top: 10px;
            }
            .content {
              margin: 40px 0;
            }
            .content p {
              font-size: 20px;
              line-height: 1.8;
              color: #333;
              margin: 15px 0;
            }
            .name {
              font-size: 36px;
              font-weight: bold;
              color: #667eea;
              margin: 20px 0;
              text-decoration: underline;
            }
            .course-title {
              font-size: 28px;
              color: #764ba2;
              font-weight: bold;
              margin: 20px 0;
            }
            .details {
              margin-top: 40px;
              display: flex;
              justify-content: space-around;
              font-size: 14px;
              color: #666;
            }
            .certificate-number {
              margin-top: 30px;
              font-size: 12px;
              color: #999;
            }
            .signature {
              margin-top: 50px;
              display: flex;
              justify-content: space-around;
            }
            .signature-line {
              border-top: 2px solid #333;
              width: 200px;
              margin-top: 50px;
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">
              <h1>Сертификат</h1>
              <div class="subtitle">о прохождении курса</div>
            </div>
            <div class="content">
              <p>Настоящим подтверждается, что</p>
              <div class="name">${certificate.user.name}</div>
              <p>успешно завершил(а) курс</p>
              <div class="course-title">"${certificate.course.title}"</div>
              <p>Преподаватель: ${certificate.course.instructor}</p>
            </div>
            <div class="details">
              <div>
                <strong>Дата выдачи:</strong><br>
                ${new Date(certificate.issuedAt).toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div>
                <strong>Категория:</strong><br>
                ${certificate.course.category}
              </div>
            </div>
            <div class="certificate-number">
              Номер сертификата: ${certificate.certificateNumber}
            </div>
            <div class="signature">
              <div>
                <div class="signature-line"></div>
                <p style="margin-top: 10px;">Подпись</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <p className="text-gray-600 text-lg">Загрузка сертификата...</p>
        </div>
      </Layout>
    );
  }

  if (error || !certificate) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Ошибка</h1>
            <p className="text-gray-600 mb-6">{error || "Сертификат не найден"}</p>
            <button
              onClick={() => router.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Назад
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Сертификат - {certificate.course.title} - EduPlatform</title>
        <meta
          name="description"
          content={`Сертификат о прохождении курса ${certificate.course.title}`}
        />
      </Head>
      <Layout>
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 min-h-screen py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Certificate Display */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white text-center">
                  <Award className="w-16 h-16 mx-auto mb-4" />
                  <h1 className="text-4xl font-bold mb-2">Сертификат</h1>
                  <p className="text-lg opacity-90">о прохождении курса</p>
                </div>

                <div className="p-12">
                  <div className="text-center mb-8">
                    <p className="text-xl text-gray-700 mb-4">Настоящим подтверждается, что</p>
                    <div className="text-4xl font-bold text-purple-600 mb-4 border-b-4 border-purple-200 pb-4 inline-block px-8">
                      {certificate.user.name}
                    </div>
                    <p className="text-xl text-gray-700 mb-6">успешно завершил(а) курс</p>
                    <div className="text-3xl font-bold text-indigo-600 mb-6">
                      "{certificate.course.title}"
                    </div>
                    <p className="text-lg text-gray-600 mb-2">
                      Преподаватель: <span className="font-semibold">{certificate.course.instructor}</span>
                    </p>
                  </div>

                  <div className="border-t-2 border-gray-200 pt-8 mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-6 h-6 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-500">Дата выдачи</p>
                          <p className="font-semibold text-gray-800">
                            {new Date(certificate.issuedAt).toLocaleDateString("ru-RU", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                        <div>
                          <p className="text-sm text-gray-500">Категория</p>
                          <p className="font-semibold text-gray-800">{certificate.course.category}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500 mb-1">Номер сертификата</p>
                      <p className="font-mono text-lg font-bold text-gray-800">
                        {certificate.certificateNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition shadow-lg">
                  <Download className="w-5 h-5" />
                  <span>Скачать / Печать</span>
                </button>
                <button
                  onClick={() => router.push(`/courses/${certificate.course.id}`)}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition">
                  <BookOpen className="w-5 h-5" />
                  <span>К курсу</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
