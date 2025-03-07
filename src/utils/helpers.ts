export const formatCompensationType = (type: string): string => {
    switch (type) {
        case 'InKind':
            return 'In-Kind (Products/Services)';
        case 'FixedFee':
            return 'Fixed Fee';
        case 'Commission':
            return 'Commission-Based';
        default:
            return type;
    }
};
