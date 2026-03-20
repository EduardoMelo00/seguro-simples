"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/shared/Logo";
import {
  Users,
  UserPlus,
  TrendingUp,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Eye,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface LeadPlan {
  plan: { name: string; slug: string };
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  leadPlans: LeadPlan[];
  conversation?: { messages: unknown; profile: unknown } | null;
}

interface Stats {
  total: number;
  newToday: number;
  byStatus: Record<string, number>;
  conversionRate: string;
}

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  CONTACTED: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  NEGOTIATING: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  CLOSED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  LOST: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const STATUS_LABELS: Record<string, string> = {
  NEW: "Novo",
  CONTACTED: "Contatado",
  NEGOTIATING: "Negociando",
  CLOSED: "Fechado",
  LOST: "Perdido",
};

export default function AdminLeadsPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("ss_admin_token");
    if (saved) setToken(saved);
  }, []);

  const fetchWithAuth = useCallback(
    async (url: string, options: RequestInit = {}) => {
      return fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    },
    [token],
  );

  const loadLeads = useCallback(async () => {
    if (!token) return;
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (statusFilter) params.set("status", statusFilter);

    const res = await fetchWithAuth(`/leads?${params}`);
    if (res.status === 401) {
      setToken(null);
      localStorage.removeItem("ss_admin_token");
      return;
    }
    const data = await res.json();
    setLeads(data.data);
    setTotalPages(data.meta.pages);
  }, [token, page, statusFilter, fetchWithAuth]);

  const loadStats = useCallback(async () => {
    if (!token) return;
    const res = await fetchWithAuth("/leads/stats");
    if (res.ok) {
      setStats(await res.json());
    }
  }, [token, fetchWithAuth]);

  useEffect(() => {
    if (token) {
      loadLeads();
      loadStats();
    }
  }, [token, loadLeads, loadStats]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setLoginError("Credenciais invalidas");
      return;
    }

    const data = await res.json();
    setToken(data.accessToken);
    localStorage.setItem("ss_admin_token", data.accessToken);
  }

  async function updateStatus(leadId: string, status: string) {
    await fetchWithAuth(`/leads/${leadId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    loadLeads();
    loadStats();
    if (selectedLead?.id === leadId) {
      setSelectedLead({ ...selectedLead, status });
    }
  }

  function handleLogout() {
    setToken(null);
    localStorage.removeItem("ss_admin_token");
  }

  if (!token) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <div className="w-full max-w-sm p-8 bg-card rounded-2xl border border-border">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h2 className="text-xl font-bold text-center mb-6">
            Painel do Corretor
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm"
            />
            {loginError && (
              <p className="text-red-500 text-sm">{loginError}</p>
            )}
            <Button type="submit" className="w-full rounded-xl h-12">
              Entrar
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="text-sm text-muted-foreground">Painel Admin</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Sair
        </Button>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Total Leads
                </span>
              </div>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-1">
                <UserPlus className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">
                  Novos Hoje
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-500">
                {stats.newToday}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-muted-foreground">
                  Conversao
                </span>
              </div>
              <p className="text-2xl font-bold text-emerald-500">
                {stats.conversionRate}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-muted-foreground">
                  Em Negociacao
                </span>
              </div>
              <p className="text-2xl font-bold text-purple-500">
                {stats.byStatus?.NEGOTIATING || 0}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm text-muted-foreground">Filtrar:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm"
          >
            <option value="">Todos</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium">Nome</th>
                  <th className="text-left px-4 py-3 font-medium">Contato</th>
                  <th className="text-left px-4 py-3 font-medium">Cidade</th>
                  <th className="text-left px-4 py-3 font-medium">Planos</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Data</th>
                  <th className="text-left px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20"
                  >
                    <td className="px-4 py-3 font-medium">{lead.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {lead.phone}
                        </span>
                        {lead.email && (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Mail className="w-3 h-3" /> {lead.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {lead.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {lead.city}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {lead.leadPlans.map((lp) => (
                          <Badge
                            key={lp.plan.slug}
                            variant="secondary"
                            className="text-xs"
                          >
                            {lp.plan.name}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          updateStatus(lead.id, e.target.value)
                        }
                        className={`rounded-full px-2.5 py-1 text-xs font-medium border-0 cursor-pointer ${STATUS_COLORS[lead.status] || ""}`}
                      >
                        {Object.entries(STATUS_LABELS).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-muted-foreground"
                    >
                      Nenhum lead encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Pagina {page} de {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {selectedLead && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="bg-card rounded-2xl border border-border max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">{selectedLead.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Lead criado em{" "}
                  {new Date(selectedLead.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>
              <Badge
                className={STATUS_COLORS[selectedLead.status]}
              >
                {STATUS_LABELS[selectedLead.status]}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Telefone</p>
                <p className="font-medium">{selectedLead.phone}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{selectedLead.email || "-"}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Cidade</p>
                <p className="font-medium">{selectedLead.city || "-"}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Planos</p>
                <div className="flex flex-wrap gap-1">
                  {selectedLead.leadPlans.map((lp) => (
                    <Badge key={lp.plan.slug} variant="secondary" className="text-xs">
                      {lp.plan.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {Array.isArray(selectedLead.conversation?.messages) && (
              <div>
                <h4 className="font-semibold mb-3">Conversa com a Clara</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto rounded-xl bg-muted/20 p-4">
                  {(
                    selectedLead.conversation.messages as Array<{
                      role: string;
                      content: string;
                    }>
                  ).map((msg, i) => (
                    <div
                      key={i}
                      className={`text-sm ${msg.role === "user" ? "text-blue-500" : "text-foreground"}`}
                    >
                      <span className="font-medium">
                        {msg.role === "user" ? "Usuario" : "Clara"}:
                      </span>{" "}
                      {msg.content.replace(
                        /\[(CHIPS|COMPARE|LEAD):[\s\S]*?\]/g,
                        "",
                      ).trim()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <Button
                variant="ghost"
                onClick={() => setSelectedLead(null)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
