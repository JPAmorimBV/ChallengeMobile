export class FormatUtils {
  /**
   * Formata data no padrão brasileiro
   */
  static formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateObj);
  }

  /**
   * Formata data e hora no padrão brasileiro
   */
  static formatDateTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  }

  /**
   * Formata texto em primeira letra maiúscula
   */
  static capitalizeFirst(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  /**
   * Formata texto em formato título
   */
  static titleCase(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .split(' ')
      .map(word => this.capitalizeFirst(word))
      .join(' ');
  }

  /**
   * Trunca texto com reticências
   */
  static truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  }

  /**
   * Formata placa de moto
   */
  static formatPlaca(placa: string): string {
    if (!placa) return '';
    const cleanPlaca = placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (cleanPlaca.length >= 7) {
      return `${cleanPlaca.slice(0, 3)}-${cleanPlaca.slice(3, 7)}`;
    }
    return cleanPlaca;
  }

  /**
   * Formata número de telefone brasileiro
   */
  static formatPhone(phone: string): string {
    if (!phone) return '';
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 11) {
      return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
    } else if (cleanPhone.length === 10) {
      return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
    }
    
    return phone;
  }

  /**
   * Formata CEP brasileiro
   */
  static formatCEP(cep: string): string {
    if (!cep) return '';
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length === 8) {
      return `${cleanCEP.slice(0, 5)}-${cleanCEP.slice(5)}`;
    }
    return cep;
  }

  /**
   * Remove acentos de uma string
   */
  static removeAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Converte texto para slug (URL-friendly)
   */
  static toSlug(text: string): string {
    return this.removeAccents(text)
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Formata número com separadores de milhares
   */
  static formatNumber(num: number): string {
    return new Intl.NumberFormat('pt-BR').format(num);
  }

  /**
   * Formata moeda brasileira
   */
  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
}
