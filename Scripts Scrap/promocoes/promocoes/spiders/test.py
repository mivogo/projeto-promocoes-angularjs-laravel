def jobOffers(scores, lowerLimits, upperLimits):
    result = []
    for a in range(len(lowerLimits)):
        result.append(0)

    for i in range(len(lowerLimits)):
        for ii in range(len(scores)):
            if long(scores[ii]) >= long(lowerLimits[i]) and long(scores[ii]) <= long(upperLimits[i]):
                result[i] += 1
    return result