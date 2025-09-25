import { VALIDATION_REGEX } from '@/constants/app';

export class ValidationUtils {
  /**
   * Valida formato de email
   */
  static isValidEmail(email: string): boolean {
    return VALIDATION_REGEX.EMAIL.test(email.trim());
  }

  /**
   * Valida formato de placa brasileira
   */
  static isValidPlaca(placa: string): boolean {
    return VALIDATION_REGEX.PLACA.test(placa.toUpperCase());
  }

  /**
   * Valida se a string não está vazia
   */
  static isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
  }

  /**
   * Valida tamanho mínimo da string
   */
  static hasMinLength(value: string, minLength: number): boolean {
    return value.trim().length >= minLength;
  }

  /**
   * Valida tamanho máximo da string
   */
  static hasMaxLength(value: string, maxLength: number): boolean {
    return value.trim().length <= maxLength;
  }

  /**
   * Valida se o valor é um número válido
   */
  static isValidNumber(value: any): boolean {
    return !isNaN(value) && !isNaN(parseFloat(value));
  }

  /**
   * Valida se o ID é válido (maior que 0)
   */
  static isValidId(id: number): boolean {
    return this.isValidNumber(id) && id > 0;
  }

  /**
   * Valida formato de telefone brasileiro
   */
  static isValidPhone(phone: string): boolean {
    return VALIDATION_REGEX.PHONE.test(phone);
  }

  /**
   * Valida senha forte
   */
  static isStrongPassword(password: string): boolean {
    // Pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  /**
   * Valida se duas senhas coincidem
   */
  static passwordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  /**
   * Remove caracteres especiais de uma string
   */
  static removeSpecialCharacters(value: string): string {
    return value.replace(/[^a-zA-Z0-9\s]/g, '');
  }

  /**
   * Formata placa no padrão brasileiro
   */
  static formatPlaca(placa: string): string {
    const cleanPlaca = placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (cleanPlaca.length >= 7) {
      return `${cleanPlaca.slice(0, 3)}-${cleanPlaca.slice(3, 7)}`;
    }
    return cleanPlaca;
  }

  /**
   * Valida objeto de moto
   */
  static validateMoto(moto: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!moto.placa || !this.isValidPlaca(moto.placa)) {
      errors.push('Placa deve estar no formato ABC-1234');
    }

    if (!moto.status || !this.isNotEmpty(moto.status)) {
      errors.push('Status é obrigatório');
    }

    if (!moto.filialId || !this.isValidId(moto.filialId)) {
      errors.push('Filial é obrigatória');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Valida objeto de filial
   */
  static validateFilial(filial: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!filial.nome || !this.hasMinLength(filial.nome, 3)) {
      errors.push('Nome deve ter pelo menos 3 caracteres');
    }

    if (!filial.endereco || !this.hasMinLength(filial.endereco, 10)) {
      errors.push('Endereço deve ter pelo menos 10 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
