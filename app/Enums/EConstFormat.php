<?php

namespace App\Enums;


/**
 * For usage in \Core\Traits\Constable::getConstName
 * @package Core\Enums
 */
class EConstFormat {
    const NONE = 0;                                                       /** Standard format as in code */
    const SPACES = (1 << 0);                                              /** Spaces in place of underscores */
    const LOWERCASE = (1 << 1);                                           /** All lowercase */
    const UPPERCASE_FIRST = (1 << 2) | self::LOWERCASE;                   /** First letter capitalized */
    const TITLE_CASE = (1 << 3) | self::LOWERCASE | self::SPACES;         /** Implies SPACES. Each word capitalized. */
}
