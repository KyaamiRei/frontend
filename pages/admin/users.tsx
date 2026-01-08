import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Layout } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { Users, Shield, GraduationCap, UserCheck, AlertCircle } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  avatar?: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace("/");
    }
  }, [authLoading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin && user) {
      fetchUsers();
    }
  }, [isAdmin, user]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/users?adminId=${user?.id}`);
      if (!response.ok) {
        throw new Error("Ошибка загрузки пользователей");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
      setError("Не удалось загрузить список пользователей");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: "STUDENT" | "TEACHER" | "ADMIN") => {
    try {
      setUpdatingUserId(userId);
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: newRole,
          adminId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка обновления роли");
      }

      // Обновляем список пользователей
      await fetchUsers();
    } catch (error) {
      console.error("Ошибка обновления роли:", error);
      alert("Не удалось обновить роль пользователя");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="w-5 h-5 text-red-600" />;
      case "TEACHER":
        return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case "STUDENT":
        return <UserCheck className="w-5 h-5 text-green-600" />;
      default:
        return null;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Администратор";
      case "TEACHER":
        return "Учитель";
      case "STUDENT":
        return "Ученик";
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "TEACHER":
        return "bg-blue-100 text-blue-800";
      case "STUDENT":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Доступ запрещен. Только администраторы могут просматривать эту страницу.</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Управление пользователями - EduPlatform</title>
        <meta name="description" content="Управление пользователями и ролями" />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <Users className="w-8 h-8 mr-3" />
              Управление пользователями
            </h1>
            <p className="text-gray-600">Управление ролями пользователей системы</p>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Загрузка пользователей...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Пользователь
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Текущая роль
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Изменить роль
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дата регистрации
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {u.avatar ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={u.avatar}
                                alt={u.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-gray-600 font-medium">
                                  {u.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{u.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{u.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                              u.role
                            )}`}>
                            {getRoleIcon(u.role)}
                            <span className="ml-1">{getRoleLabel(u.role)}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              updateUserRole(u.id, e.target.value as "STUDENT" | "TEACHER" | "ADMIN")
                            }
                            disabled={updatingUserId === u.id}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                            <option value="STUDENT">Ученик</option>
                            <option value="TEACHER">Учитель</option>
                            <option value="ADMIN">Администратор</option>
                          </select>
                          {updatingUserId === u.id && (
                            <span className="text-xs text-gray-500 ml-2">Обновление...</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(u.createdAt).toLocaleDateString("ru-RU", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

